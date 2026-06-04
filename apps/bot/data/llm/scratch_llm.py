#!/usr/bin/env python3
"""
scratch_llm.py — Un LLM construit à partir de zéro (Transformer décodeur) en PyTorch,
conçu pour s'entraîner localement sur 12 threads CPU et moins de 20 Go de RAM.

Ce script implémente :
1. Un Tokenizer de caractères personnalisé.
2. L'architecture Transformer complète (Causal Self-Attention, RMSNorm, FeedForward, blocks résiduels).
3. Le chargement et le parsing du dataset SFT Dragon Ball (dbz-sft.jsonl).
4. La boucle d'entraînement optimisée pour le CPU en multi-threadé.
5. Une fonction d'inférence/génération de texte.

Usage :
    python3 scratch_llm.py --train
"""

import os
import sys
import json
import argparse
from os.path import join
import torch
import torch.nn as nn
from torch.nn import functional as F
from torch.utils.data import Dataset, DataLoader

# --- CONFIGURATION DES CHEMINS ---
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# --- CONFIGURATION MATÉRIELLE ---
# Configurer PyTorch pour utiliser exactement 12 threads CPU
torch.set_num_threads(12)
torch.set_num_interop_threads(12)

# --- HYPERPARAMÈTRES POUR CPU (12 Threads, < 20 Go RAM) ---
BATCH_SIZE = 16          # Taille de lot
BLOCK_SIZE = 256         # Longueur de contexte max (tokens)
N_EMBD = 384             # Dimension d'embedding
N_HEAD = 6               # Nombre de têtes d'attention (64 dim par tête)
N_LAYER = 6              # Nombre de couches Transformer
DROPOUT = 0.1
LEARNING_RATE = 5e-4
EPOCHS = 3
DEVICE = 'cpu'

# --- 1. TOKENIZER CARACTÈRE DE ZERO ---
class CharacterTokenizer:
    def __init__(self, text=""):
        # Initialiser avec des caractères DBZ courants et la table ASCII de base
        chars = sorted(list(set(text + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?'\"()-+/*:; \n\téèàùçâêîôûëïü🥋🪐🧬⚡🔥📖🎬🎮📺📜🤖🌌🐉")))
        self.stoi = { ch:i for i,ch in enumerate(chars) }
        self.itos = { i:ch for i,ch in enumerate(chars) }
        self.vocab_size = len(chars)

    def encode(self, s):
        # Utiliser un token spécial (espace ou point d'interrogation) pour les caractères inconnus
        return [self.stoi.get(c, self.stoi.get(' ', 0)) for c in s]

    def decode(self, l):
        return ''.join([self.itos.get(i, '') for i in l])

# --- 2. ARCHITECTURE TRANSFORMER DE ZERO ---
class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x):
        variance = x.pow(2).mean(-1, keepdim=True)
        return x * torch.rsqrt(variance + self.eps) * self.weight

class CausalSelfAttention(nn.Module):
    def __init__(self):
        super().__init__()
        assert N_EMBD % N_HEAD == 0
        self.c_attn = nn.Linear(N_EMBD, 3 * N_EMBD, bias=False)
        self.c_proj = nn.Linear(N_EMBD, N_EMBD, bias=False)
        self.attn_dropout = nn.Dropout(DROPOUT)
        self.resid_dropout = nn.Dropout(DROPOUT)
        # Masque causal triangulaire inférieur
        self.register_buffer("bias", torch.tril(torch.ones(BLOCK_SIZE, BLOCK_SIZE))
                                     .view(1, 1, BLOCK_SIZE, BLOCK_SIZE))

    def forward(self, x):
        B, T, C = x.size()
        # Calcul Q, K, V
        q, k, v  = self.c_attn(x).split(N_EMBD, dim=2)
        k = k.view(B, T, N_HEAD, C // N_HEAD).transpose(1, 2) # (B, nh, T, hs)
        q = q.view(B, T, N_HEAD, C // N_HEAD).transpose(1, 2)
        v = v.view(B, T, N_HEAD, C // N_HEAD).transpose(1, 2)

        # Calcul attention matrix
        att = (q @ k.transpose(-2, -1)) * (1.0 / (k.size(-1) ** 0.5))
        att = att.masked_fill(self.bias[:,:,:T,:T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        att = self.attn_dropout(att)
        y = att @ v # (B, nh, T, hs)
        y = y.transpose(1, 2).contiguous().view(B, T, C)

        # Projection de sortie
        y = self.resid_dropout(self.c_proj(y))
        return y

class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        # SwiGLU / Gated MLP simplifié
        self.w1 = nn.Linear(N_EMBD, 4 * N_EMBD, bias=False)
        self.w2 = nn.Linear(N_EMBD, 4 * N_EMBD, bias=False)
        self.w3 = nn.Linear(4 * N_EMBD, N_EMBD, bias=False)
        self.dropout = nn.Dropout(DROPOUT)

    def forward(self, x):
        # Swish(x) * y gate
        x1 = self.w1(x)
        return self.dropout(self.w3(F.silu(x1) * self.w2(x)))

class Block(nn.Module):
    def __init__(self):
        super().__init__()
        self.ln1 = RMSNorm(N_EMBD)
        self.attn = CausalSelfAttention()
        self.ln2 = RMSNorm(N_EMBD)
        self.mlp = MLP()

    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x

class DragonBallLLM(nn.Module):
    def __init__(self, vocab_size):
        super().__init__()
        self.token_embedding_table = nn.Embedding(vocab_size, N_EMBD)
        self.position_embedding_table = nn.Embedding(BLOCK_SIZE, N_EMBD)
        self.blocks = nn.Sequential(*[Block() for _ in range(N_LAYER)])
        self.ln_f = RMSNorm(N_EMBD)
        self.lm_head = nn.Linear(N_EMBD, vocab_size, bias=False)
        # Partage des poids d'embedding et de projection finale (weight tying)
        self.token_embedding_table.weight = self.lm_head.weight

    def forward(self, idx, targets=None):
        B, T = idx.size()
        tok_emb = self.token_embedding_table(idx) # (B,T,C)
        pos_emb = self.position_embedding_table(torch.arange(T, device=DEVICE)) # (T,C)
        x = tok_emb + pos_emb # (B,T,C)
        x = self.blocks(x) # (B,T,C)
        x = self.ln_f(x) # (B,T,C)
        logits = self.lm_head(x) # (B,T,vocab_size)

        loss = None
        if targets is not None:
            B, T, C = logits.size()
            logits_flat = logits.view(B*T, C)
            targets_flat = targets.view(B*T)
            loss = F.cross_entropy(logits_flat, targets_flat)

        return logits, loss

    @torch.no_grad()
    def generate(self, idx, max_new_tokens, tokenizer, temperature=0.7):
        for _ in range(max_new_tokens):
            idx_cond = idx[:, -BLOCK_SIZE:]
            logits, _ = self(idx_cond)
            logits = logits[:, -1, :] / temperature
            probs = F.softmax(logits, dim=-1)
            next_token = torch.multinomial(probs, num_samples=1)
            idx = torch.cat((idx, next_token), dim=1)
            # Affichage en streaming
            char = tokenizer.decode([next_token.item()])
            print(char, end='', flush=True)
        print()
        return idx

# --- 3. DATASET SFT ---
class SftDataset(Dataset):
    def __init__(self, jsonl_path, tokenizer):
        self.samples = []
        if not os.path.exists(jsonl_path):
            # Créer des échantillons de fallback si le fichier n'existe pas encore
            print(f"[LLM] Fichier {jsonl_path} absent. Utilisation d'exemples statiques de démo.")
            demo_data = [
                {"instruction": "Qui est Son Goku ?", "output": "Son Goku est un Saiyan de l'Univers 7 élevé sur Terre."},
                {"instruction": "Quelle est la technique phare de Goku ?", "output": "Le Kamehameha est la technique phare de Goku."},
                {"instruction": "Qui est Whis ?", "output": "Whis est l'ange guide et instructeur de Beerus."}
            ]
            for d in demo_data:
                text = f"<s>[INST] {d['instruction']} [/INST] {d['output']} </s>"
                self.samples.append(tokenizer.encode(text))
            return

        with open(jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    data = json.loads(line)
                    inst = data.get("instruction", "")
                    inp = data.get("input", "")
                    out = data.get("output", "")
                    persona = data.get("persona", "whis")
                    prompt = f"<s>[INST] ({persona}) {inst} {inp} [/INST] {out} </s>"
                    self.samples.append(tokenizer.encode(prompt))
                except Exception:
                    continue

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        encoded = self.samples[idx]
        # Tronquer ou padder à BLOCK_SIZE + 1 (pour x et y décale d'un pas)
        if len(encoded) < BLOCK_SIZE + 1:
            encoded = encoded + [0] * (BLOCK_SIZE + 1 - len(encoded))
        else:
            encoded = encoded[:BLOCK_SIZE + 1]
        
        x = torch.tensor(encoded[:-1], dtype=torch.long)
        y = torch.tensor(encoded[1:], dtype=torch.long)
        return x, y

# --- 4. ENTRAÎNEMENT & LE BOUCLAGE ---
def train(model, dataset, tokenizer, model_path):
    loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True, drop_last=True)
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)
    
    print(f"\n[LLM] Lancement de l'entraînement sur CPU (12 threads).")
    print(f"[LLM] Nombre total de batches : {len(loader)} | Époques : {EPOCHS}")
    
    model.train()
    for epoch in range(EPOCHS):
        total_loss = 0
        for batch_idx, (x, y) in enumerate(loader):
            x, y = x.to(DEVICE), y.to(DEVICE)
            logits, loss = model(x, y)
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            if batch_idx % 10 == 0:
                print(f"Époque {epoch+1}/{EPOCHS} | Batch {batch_idx}/{len(loader)} | Loss: {loss.item():.4f}")
        
        avg_loss = total_loss / len(loader)
        print(f"--> Époque {epoch+1} achevée | Loss moyenne : {avg_loss:.4f}")
        
        # Test de génération rapide après chaque époque
        print("\n[TEST INFERENCE] Prompt: '<s>[INST] (whis) Qui est Goku ? [/INST] ' -> ")
        model.eval()
        context = torch.tensor([tokenizer.encode("<s>[INST] (whis) Qui est Goku ? [/INST] ")], dtype=torch.long, device=DEVICE)
        model.generate(context, max_new_tokens=50, tokenizer=tokenizer)
        model.train()

    # Sauvegarder les poids
    torch.save({
        'model_state_dict': model.state_dict(),
        'vocab_size': tokenizer.vocab_size,
        'stoi': tokenizer.stoi,
        'itos': tokenizer.itos
    }, model_path)
    print(f"[LLM] Modèle sauvegardé avec succès dans {model_path}")

def main():
    parser = argparse.ArgumentParser(description="LLM Dragon Ball from scratch sur CPU")
    parser.add_argument("--train", action="store_true", help="Lance l'entraînement du modèle")
    parser.add_argument("--prompt", type=str, default="Qui est Whis ?", help="Prompt pour la génération")
    parser.add_argument("--persona", type=str, default="whis", help="Persona (whis, beerus, shenron)")
    args = parser.parse_args()

    sft_path = join(OUT_DIR, "dbz-sft.jsonl")
    model_path = join(OUT_DIR, "dbz_scratch_model.pt")

    # Initialisation du tokenizer
    # Charger un grand corpus texte de démo pour le vocabulaire initial si SFT vide
    text_corpus = ""
    if os.path.exists(sft_path):
        with open(sft_path, "r", encoding="utf-8") as f:
            for _ in range(500): # charger un échantillon pour choper le vocabulaire
                line = f.readline()
                if not line: break
                text_corpus += line
    tokenizer = CharacterTokenizer(text_corpus)
    print(f"[LLM] Taille du vocabulaire construit : {tokenizer.vocab_size} caractères uniques.")

    model = DragonBallLLM(tokenizer.vocab_size).to(DEVICE)

    if args.train:
        dataset = SftDataset(sft_path, tokenizer)
        train(model, dataset, tokenizer, model_path)
    else:
        # Charger le modèle s'il existe
        if os.path.exists(model_path):
            checkpoint = torch.load(model_path, map_location=DEVICE)
            tokenizer.stoi = checkpoint['stoi']
            tokenizer.itos = checkpoint['itos']
            tokenizer.vocab_size = checkpoint['vocab_size']
            model = DragonBallLLM(tokenizer.vocab_size).to(DEVICE)
            model.load_state_dict(checkpoint['model_state_dict'])
            print(f"[LLM] Modèle chargé depuis {model_path}")
        else:
            print("[LLM] Aucun checkpoint trouvé. Entraînez le modèle d'abord avec --train")
            sys.exit(1)

        model.eval()
        prompt_full = f"<s>[INST] ({args.persona}) {args.prompt} [/INST] "
        print(f"\n[GENERATION] Prompt: {prompt_full}\nRéponse: ")
        context = torch.tensor([tokenizer.encode(prompt_full)], dtype=torch.long, device=DEVICE)
        model.generate(context, max_new_tokens=150, tokenizer=tokenizer)

if __name__ == "__main__":
    main()
