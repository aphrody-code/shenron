#!/usr/bin/env python3
"""
dbz_llm.py — NOTRE LLM Dragon Ball maison (decoder Transformer, from scratch, PyTorch CPU).

Pas un wrapper d'API : on entraîne, on sert et on possède le modèle.
Améliorations vs l'ancien scratch_llm.py :
  - Tokenizer BPE byte-level (≈8k) au lieu de char-level  -> 4x moins de tokens, vrai sens lexical.
  - Modèle plus grand (6 couches, 512 dim) entraîné sur le VRAI corpus wiki (2.3M car) + 933 SFT ancrés.
  - 2 phases : pré-entraînement langue (corpus.txt) puis SFT instruction avec MASQUAGE du prompt
    (la loss ne porte que sur la réponse) -> apprend à répondre, pas à recopier le contexte.
  - Génération avec repetition penalty + no-repeat-ngram + top-p (anti-boucle des petits modèles).
  - Serveur d'inférence stdlib (port 5009) : POST /generate {context, persona, query} -> {answer}.

Le runtime du bot n'appelle QUE ce modèle (cf. llm.ts backend "own"). Aucun modèle tiers en prod.

Sous-commandes :
    python3 dbz_llm.py tokenizer     # entraîne le tokenizer BPE
    python3 dbz_llm.py pretrain      # pré-entraînement langue sur corpus.txt
    python3 dbz_llm.py sft           # fine-tuning instruction sur sft.jsonl
    python3 dbz_llm.py train         # tokenizer + pretrain + sft (pipeline complet)
    python3 dbz_llm.py generate --persona whis --context "..." --query "Qui est Goku ?"
    python3 dbz_llm.py serve --port 5009
"""
import os
import sys
import json
import math
import time
import argparse
from dataclasses import dataclass, asdict

import torch
import torch.nn as nn
from torch.nn import functional as F

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
CORPUS_PATH = os.path.join(OUT_DIR, "corpus.txt")
SFT_PATH = os.path.join(OUT_DIR, "sft.jsonl")
TOKENIZER_PATH = os.path.join(OUT_DIR, "dbz_tokenizer.json")
MODEL_PATH = os.path.join(OUT_DIR, "dbz_own_model.pt")
CONFIG_PATH = os.path.join(OUT_DIR, "dbz_model_config.json")

THREADS = int(os.environ.get("DBZ_THREADS", "12"))
torch.set_num_threads(THREADS)
DEVICE = "cpu"

SPECIALS = ["<|pad|>", "<|endoftext|>", "<|ctx|>", "<|persona|>", "<|user|>", "<|bot|>"]


@dataclass
class Config:
    vocab_size: int = 8000
    block_size: int = 512
    n_layer: int = 6
    n_embd: int = 512
    n_head: int = 8
    dropout: float = 0.1


# ----------------------------------------------------------------------------
# Tokenizer (BPE byte-level)
# ----------------------------------------------------------------------------
def train_tokenizer(vocab_size: int = 8000) -> None:
    from tokenizers import ByteLevelBPETokenizer

    # Corpus d'entraînement du tokenizer : corpus brut + champs SFT (pour voir le format).
    tmp = os.path.join(OUT_DIR, "_tok_train.txt")
    with open(tmp, "w", encoding="utf-8") as w:
        if os.path.exists(CORPUS_PATH):
            with open(CORPUS_PATH, encoding="utf-8") as f:
                w.write(f.read())
        if os.path.exists(SFT_PATH):
            for line in open(SFT_PATH, encoding="utf-8"):
                line = line.strip()
                if not line:
                    continue
                try:
                    o = json.loads(line)
                except Exception:
                    continue
                w.write("\n" + " ".join(str(o.get(k, "")) for k in ("context", "instruction", "output")))

    tok = ByteLevelBPETokenizer()
    tok.train(files=[tmp], vocab_size=vocab_size, min_frequency=2, special_tokens=SPECIALS)
    tok.save(TOKENIZER_PATH)
    os.remove(tmp)
    print(f"[TOK] Tokenizer BPE entraîné (vocab={tok.get_vocab_size()}) -> {TOKENIZER_PATH}")


def load_tokenizer():
    from tokenizers import Tokenizer

    tok = Tokenizer.from_file(TOKENIZER_PATH)
    return tok


# ----------------------------------------------------------------------------
# Architecture (decoder Transformer : RMSNorm + Causal Attn + SwiGLU, weight tying)
# ----------------------------------------------------------------------------
class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x):
        var = x.pow(2).mean(-1, keepdim=True)
        return x * torch.rsqrt(var + self.eps) * self.weight


class CausalSelfAttention(nn.Module):
    def __init__(self, cfg: Config):
        super().__init__()
        assert cfg.n_embd % cfg.n_head == 0
        self.n_head = cfg.n_head
        self.c_attn = nn.Linear(cfg.n_embd, 3 * cfg.n_embd, bias=False)
        self.c_proj = nn.Linear(cfg.n_embd, cfg.n_embd, bias=False)
        self.attn_dropout = nn.Dropout(cfg.dropout)
        self.resid_dropout = nn.Dropout(cfg.dropout)
        self.register_buffer(
            "bias",
            torch.tril(torch.ones(cfg.block_size, cfg.block_size)).view(1, 1, cfg.block_size, cfg.block_size),
        )

    def forward(self, x):
        B, T, C = x.size()
        q, k, v = self.c_attn(x).split(C, dim=2)
        hs = C // self.n_head
        k = k.view(B, T, self.n_head, hs).transpose(1, 2)
        q = q.view(B, T, self.n_head, hs).transpose(1, 2)
        v = v.view(B, T, self.n_head, hs).transpose(1, 2)
        att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(hs))
        att = att.masked_fill(self.bias[:, :, :T, :T] == 0, float("-inf"))
        att = F.softmax(att, dim=-1)
        att = self.attn_dropout(att)
        y = att @ v
        y = y.transpose(1, 2).contiguous().view(B, T, C)
        return self.resid_dropout(self.c_proj(y))


class MLP(nn.Module):
    def __init__(self, cfg: Config):
        super().__init__()
        self.w1 = nn.Linear(cfg.n_embd, 4 * cfg.n_embd, bias=False)
        self.w2 = nn.Linear(cfg.n_embd, 4 * cfg.n_embd, bias=False)
        self.w3 = nn.Linear(4 * cfg.n_embd, cfg.n_embd, bias=False)
        self.dropout = nn.Dropout(cfg.dropout)

    def forward(self, x):
        return self.dropout(self.w3(F.silu(self.w1(x)) * self.w2(x)))


class Block(nn.Module):
    def __init__(self, cfg: Config):
        super().__init__()
        self.ln1 = RMSNorm(cfg.n_embd)
        self.attn = CausalSelfAttention(cfg)
        self.ln2 = RMSNorm(cfg.n_embd)
        self.mlp = MLP(cfg)

    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x


class DragonBallLLM(nn.Module):
    def __init__(self, cfg: Config):
        super().__init__()
        self.cfg = cfg
        self.tok_emb = nn.Embedding(cfg.vocab_size, cfg.n_embd)
        self.pos_emb = nn.Embedding(cfg.block_size, cfg.n_embd)
        self.drop = nn.Dropout(cfg.dropout)
        self.blocks = nn.ModuleList([Block(cfg) for _ in range(cfg.n_layer)])
        self.ln_f = RMSNorm(cfg.n_embd)
        self.lm_head = nn.Linear(cfg.n_embd, cfg.vocab_size, bias=False)
        self.tok_emb.weight = self.lm_head.weight  # weight tying
        self.apply(self._init)

    def _init(self, m):
        if isinstance(m, nn.Linear):
            nn.init.normal_(m.weight, mean=0.0, std=0.02)
        elif isinstance(m, nn.Embedding):
            nn.init.normal_(m.weight, mean=0.0, std=0.02)

    def forward(self, idx, targets=None):
        B, T = idx.size()
        pos = torch.arange(T, device=idx.device)
        x = self.drop(self.tok_emb(idx) + self.pos_emb(pos))
        for b in self.blocks:
            x = b(x)
        x = self.ln_f(x)
        logits = self.lm_head(x)
        loss = None
        if targets is not None:
            loss = F.cross_entropy(
                logits.reshape(-1, logits.size(-1)), targets.reshape(-1), ignore_index=-100
            )
        return logits, loss

    def num_params(self):
        return sum(p.numel() for p in self.parameters()) - self.pos_emb.weight.numel()


# ----------------------------------------------------------------------------
# Format prompt (partagé entre SFT et serve -> cohérence garantie)
# ----------------------------------------------------------------------------
def build_prompt(context: str, persona: str, question: str) -> str:
    ctx = (context or "").strip()
    if len(ctx) > 1400:
        ctx = ctx[:1400]
    if not ctx:
        ctx = "Aucun contexte disponible."
    return f"<|ctx|> {ctx} <|persona|> {persona} <|user|> {question} <|bot|>"


# ----------------------------------------------------------------------------
# Données
# ----------------------------------------------------------------------------
def encode(tok, text):
    return tok.encode(text).ids


def load_pretrain_stream(tok):
    ids = []
    eot = tok.token_to_id("<|endoftext|>")
    with open(CORPUS_PATH, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            ids.extend(encode(tok, line))
            ids.append(eot)
    return torch.tensor(ids, dtype=torch.long)


def load_sft(tok, block_size):
    eot = tok.token_to_id("<|endoftext|>")
    bot = tok.token_to_id("<|bot|>")
    samples = []
    for line in open(SFT_PATH, encoding="utf-8"):
        line = line.strip()
        if not line:
            continue
        o = json.loads(line)
        prompt = build_prompt(o.get("context", ""), o.get("persona", "whis"), o["instruction"])
        p_ids = encode(tok, prompt)
        a_ids = encode(tok, " " + o["output"].strip()) + [eot]
        ids = p_ids + a_ids
        if len(ids) > block_size:
            # tronquer le contexte par la gauche pour garder question + réponse
            overflow = len(ids) - block_size
            # on retire des tokens au milieu du contexte (après <|ctx|>)
            try:
                ctx_start = p_ids.index(tok.token_to_id("<|ctx|>")) + 1
            except ValueError:
                ctx_start = 1
            p_ids = p_ids[:ctx_start] + p_ids[ctx_start + overflow:]
            ids = p_ids + a_ids
            if len(ids) > block_size:
                ids = ids[-block_size:]
                p_ids = ids[: max(1, len(ids) - len(a_ids))]
        labels = [-100] * len(p_ids) + a_ids[:]  # masque le prompt : loss sur la réponse seule
        labels = labels[: len(ids)]
        samples.append((ids, labels))
    return samples


# ----------------------------------------------------------------------------
# Entraînement
# ----------------------------------------------------------------------------
def get_batch_pretrain(stream, block_size, batch_size):
    ix = torch.randint(0, stream.size(0) - block_size - 1, (batch_size,))
    x = torch.stack([stream[i : i + block_size] for i in ix])
    y = torch.stack([stream[i + 1 : i + 1 + block_size] for i in ix])
    return x, y


def cosine_lr(step, total, base_lr, warmup):
    if step < warmup:
        return base_lr * (step + 1) / warmup
    ratio = (step - warmup) / max(1, total - warmup)
    return base_lr * 0.5 * (1 + math.cos(math.pi * min(1.0, ratio)))


def build_or_load_model(cfg: Config, fresh=False):
    if not fresh and os.path.exists(MODEL_PATH):
        ck = torch.load(MODEL_PATH, map_location=DEVICE)
        cfg = Config(**ck["config"])
        model = DragonBallLLM(cfg).to(DEVICE)
        model.load_state_dict(ck["model"])
        return model, cfg
    model = DragonBallLLM(cfg).to(DEVICE)
    return model, cfg


def save_model(model, cfg: Config):
    torch.save({"model": model.state_dict(), "config": asdict(cfg)}, MODEL_PATH)
    with open(CONFIG_PATH, "w") as f:
        json.dump(asdict(cfg), f, indent=2)


def run_pretrain(epochs=3, batch_size=12, base_lr=6e-4):
    tok = load_tokenizer()
    cfg = Config(vocab_size=tok.get_vocab_size())
    model, cfg = build_or_load_model(cfg, fresh=True)
    print(f"[PRETRAIN] params={model.num_params()/1e6:.1f}M vocab={cfg.vocab_size} block={cfg.block_size} threads={THREADS}")
    stream = load_pretrain_stream(tok)
    print(f"[PRETRAIN] corpus = {stream.size(0)/1e3:.0f}k tokens")
    steps_per_epoch = max(1, stream.size(0) // (cfg.block_size * batch_size))
    total = steps_per_epoch * epochs
    opt = torch.optim.AdamW(model.parameters(), lr=base_lr, weight_decay=0.1, betas=(0.9, 0.95))
    model.train()
    step = 0
    t0 = time.time()
    for ep in range(epochs):
        for _ in range(steps_per_epoch):
            x, y = get_batch_pretrain(stream, cfg.block_size, batch_size)
            x, y = x.to(DEVICE), y.to(DEVICE)
            lr = cosine_lr(step, total, base_lr, warmup=min(50, total // 10 + 1))
            for g in opt.param_groups:
                g["lr"] = lr
            _, loss = model(x, y)
            opt.zero_grad(set_to_none=True)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step()
            step += 1
            if step % 20 == 0:
                el = time.time() - t0
                print(f"[PRETRAIN] ep{ep+1}/{epochs} step{step}/{total} loss={loss.item():.3f} lr={lr:.2e} {el:.0f}s", flush=True)
        save_model(model, cfg)
        print(f"[PRETRAIN] epoque {ep+1} -> checkpoint sauvegardé.", flush=True)
    print(f"[PRETRAIN] terminé en {(time.time()-t0)/60:.1f} min.")


def run_sft(epochs=12, batch_size=8, base_lr=3e-4):
    tok = load_tokenizer()
    model, cfg = build_or_load_model(Config(vocab_size=tok.get_vocab_size()), fresh=False)
    print(f"[SFT] params={model.num_params()/1e6:.1f}M (reprend le checkpoint pré-entraîné)")
    samples = load_sft(tok, cfg.block_size)
    pad = tok.token_to_id("<|pad|>")
    print(f"[SFT] {len(samples)} exemples instruction (prompt masqué)")
    total = (len(samples) // batch_size) * epochs
    opt = torch.optim.AdamW(model.parameters(), lr=base_lr, weight_decay=0.1, betas=(0.9, 0.95))
    model.train()
    step = 0
    t0 = time.time()
    rng = torch.Generator().manual_seed(42)
    for ep in range(epochs):
        order = torch.randperm(len(samples), generator=rng).tolist()
        ep_loss = 0.0
        nb = 0
        for bi in range(0, len(samples) - batch_size + 1, batch_size):
            batch = [samples[order[bi + j]] for j in range(batch_size)]
            maxlen = max(len(ids) for ids, _ in batch)
            X = torch.full((batch_size, maxlen), pad, dtype=torch.long)
            Y = torch.full((batch_size, maxlen), -100, dtype=torch.long)
            for j, (ids, labels) in enumerate(batch):
                X[j, : len(ids)] = torch.tensor(ids, dtype=torch.long)
                Y[j, : len(labels)] = torch.tensor(labels, dtype=torch.long)
            # décalage causal : prédire le token suivant
            x = X[:, :-1].to(DEVICE)
            y = Y[:, 1:].to(DEVICE)
            lr = cosine_lr(step, total, base_lr, warmup=min(40, total // 10 + 1))
            for g in opt.param_groups:
                g["lr"] = lr
            _, loss = model(x, y)
            opt.zero_grad(set_to_none=True)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step()
            step += 1
            ep_loss += loss.item()
            nb += 1
            if step % 20 == 0:
                print(f"[SFT] ep{ep+1}/{epochs} step{step}/{total} loss={loss.item():.3f} lr={lr:.2e} {time.time()-t0:.0f}s", flush=True)
        save_model(model, cfg)
        print(f"[SFT] epoque {ep+1}/{epochs} loss_moy={ep_loss/max(1,nb):.3f} -> checkpoint.", flush=True)
    print(f"[SFT] terminé en {(time.time()-t0)/60:.1f} min -> {MODEL_PATH}")


# ----------------------------------------------------------------------------
# Génération
# ----------------------------------------------------------------------------
@torch.no_grad()
def generate_text(model, tok, cfg, context, persona, question,
                  max_new_tokens=160, temperature=0.7, top_p=0.92,
                  rep_penalty=1.3, no_repeat_ngram=3):
    model.eval()
    eot = tok.token_to_id("<|endoftext|>")
    prompt = build_prompt(context, persona, question)
    ids = encode(tok, prompt)
    ids = ids[-(cfg.block_size - max_new_tokens - 1):]
    x = torch.tensor([ids], dtype=torch.long, device=DEVICE)
    generated = []

    def banned_by_ngram():
        if no_repeat_ngram <= 0 or len(generated) < no_repeat_ngram - 1:
            return set()
        prefix = tuple(generated[-(no_repeat_ngram - 1):])
        banned = set()
        seq = generated
        for i in range(len(seq) - no_repeat_ngram + 1):
            if tuple(seq[i : i + no_repeat_ngram - 1]) == prefix:
                banned.add(seq[i + no_repeat_ngram - 1])
        return banned

    for _ in range(max_new_tokens):
        x_cond = x[:, -cfg.block_size:]
        logits, _ = model(x_cond)
        logits = logits[:, -1, :].squeeze(0)
        # repetition penalty
        if rep_penalty != 1.0 and generated:
            for t in set(generated):
                logits[t] /= rep_penalty
        for t in banned_by_ngram():
            logits[t] = float("-inf")
        logits = logits / max(1e-6, temperature)
        probs = F.softmax(logits, dim=-1)
        # top-p (nucleus)
        sp, si = torch.sort(probs, descending=True)
        cum = torch.cumsum(sp, dim=-1)
        mask = cum - sp > top_p
        sp[mask] = 0.0
        if sp.sum() <= 0:
            sp = probs
            si = torch.arange(probs.size(0))
        sp = sp / sp.sum()
        nxt = si[torch.multinomial(sp, 1)].item()
        if nxt == eot:
            break
        generated.append(nxt)
        x = torch.cat([x, torch.tensor([[nxt]], device=DEVICE)], dim=1)

    text = tok.decode(generated)
    return text.strip()


# ----------------------------------------------------------------------------
# Serveur d'inférence (stdlib, port 5009)
# ----------------------------------------------------------------------------
def run_serve(port=5009, host="127.0.0.1"):
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

    tok = load_tokenizer()
    model, cfg = build_or_load_model(Config(vocab_size=tok.get_vocab_size()), fresh=False)
    model.eval()
    print(f"[SERVE] modèle maison chargé ({model.num_params()/1e6:.1f}M params) sur {host}:{port}", flush=True)

    class H(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def _send(self, code, obj):
            body = json.dumps(obj).encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if self.path.startswith("/health"):
                self._send(200, {"status": "ok", "params": model.num_params(), "model": "dbz-own"})
            else:
                self._send(404, {"error": "not found"})

        def do_POST(self):
            try:
                n = int(self.headers.get("Content-Length", "0"))
                data = json.loads(self.rfile.read(n) or b"{}")
            except Exception as e:
                self._send(400, {"error": str(e)})
                return
            # Accepte {context,persona,query} OU le format OpenAI {messages:[...]}
            context = data.get("context", "")
            persona = data.get("persona", "whis")
            query = data.get("query", "")
            if not query and isinstance(data.get("messages"), list):
                sys_msgs = [m.get("content", "") for m in data["messages"] if m.get("role") == "system"]
                usr_msgs = [m.get("content", "") for m in data["messages"] if m.get("role") == "user"]
                context = "\n".join(sys_msgs)
                query = usr_msgs[-1] if usr_msgs else ""
            mnt = int(data.get("max_new_tokens", 160))
            temp = float(data.get("temperature", 0.7))
            t0 = time.time()
            try:
                answer = generate_text(model, tok, cfg, context, persona, query,
                                       max_new_tokens=mnt, temperature=temp)
            except Exception as e:
                self._send(500, {"error": str(e)})
                return
            self._send(200, {
                "answer": answer,
                "choices": [{"message": {"role": "assistant", "content": answer}}],
                "model": "dbz-own",
                "latency_ms": round((time.time() - t0) * 1000),
            })

    srv = ThreadingHTTPServer((host, port), H)
    print(f"[SERVE] prêt.", flush=True)
    srv.serve_forever()


# ----------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["tokenizer", "pretrain", "sft", "train", "generate", "serve"])
    ap.add_argument("--epochs", type=int, default=None)
    ap.add_argument("--port", type=int, default=5009)
    ap.add_argument("--persona", default="whis")
    ap.add_argument("--context", default="")
    ap.add_argument("--query", default="Qui est Goku ?")
    ap.add_argument("--vocab", type=int, default=8000)
    args = ap.parse_args()

    if args.cmd == "tokenizer":
        train_tokenizer(args.vocab)
    elif args.cmd == "pretrain":
        run_pretrain(epochs=args.epochs or 3)
    elif args.cmd == "sft":
        run_sft(epochs=args.epochs or 12)
    elif args.cmd == "train":
        train_tokenizer(args.vocab)
        run_pretrain(epochs=3)
        run_sft(epochs=12)
    elif args.cmd == "generate":
        tok = load_tokenizer()
        model, cfg = build_or_load_model(Config(vocab_size=tok.get_vocab_size()), fresh=False)
        print(generate_text(model, tok, cfg, args.context, args.persona, args.query))
    elif args.cmd == "serve":
        run_serve(port=args.port)


if __name__ == "__main__":
    main()
