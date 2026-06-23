#!/usr/bin/env python3
"""finetune_manga.py — QLoRA continued-pretrain de Gemma 4 12B sur le manga
(FR+JP), via Unsloth. API d'après le notebook officiel Gemma4_(12B)_Text.ipynb.

Cible : RTX 4070 12 Go → load_in_4bit=True + max_seq_length court + batch 1 +
gradient checkpointing Unsloth. Le 12B BF16 (25 Go) ne tient PAS ; le 4-bit (~8 Go)
+ overhead training passe (tendu). Repli E4B si OOM (OVERRIDE via env MODEL).

Dataset : data/llm/manga_pretrain.jsonl ({"text": ...}, une planche par exemple).
Sortie : LoRA + GGUF Q8_0 dans data/llm/gemma4-manga-*.

Usage : ~/.unsloth/bin/python apps/bot/data/llm/finetune_manga.py
Env   : MODEL, MAX_SEQ, EPOCHS, LR, OUTDIR, SAVE_GGUF=1
"""
import os
from pathlib import Path

from unsloth import FastModel  # doit être importé en premier (patchs)
import torch
from datasets import load_dataset
from trl import SFTConfig, SFTTrainer

HERE = Path(__file__).resolve().parent
DATA = Path(os.environ.get("DATASET", str(HERE / "manga_pretrain.jsonl")))
OUTDIR = Path(os.environ.get("OUTDIR", HERE / "gemma4-manga"))

MODEL = os.environ.get("MODEL", "unsloth/gemma-4-12b-it")
MAX_SEQ = int(os.environ.get("MAX_SEQ", "1024"))
EPOCHS = float(os.environ.get("EPOCHS", "1"))
LR = float(os.environ.get("LR", "1e-4"))  # doux : nudge de style, ne casse pas l'IT

print(f"[ft] modèle={MODEL} max_seq={MAX_SEQ} epochs={EPOCHS} lr={LR}", flush=True)

model, tokenizer = FastModel.from_pretrained(
    model_name=MODEL,
    dtype=None,                 # auto (bf16 sur Ada)
    max_seq_length=MAX_SEQ,
    load_in_4bit=True,          # QLoRA : indispensable pour tenir sur 12 Go
    full_finetuning=False,
    device_map={"": 0},         # force tout sur GPU 0 (évite un device_map offloadé → "invalid device ordinal")
)

model = FastModel.get_peft_model(
    model,
    finetune_vision_layers=False,     # texte uniquement (manga = texte)
    finetune_language_layers=True,
    finetune_attention_modules=True,
    finetune_mlp_modules=True,
    r=int(os.environ.get("RANK", "8")),
    lora_alpha=int(os.environ.get("RANK", "8")) * 2,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",  # clé pour la VRAM
    random_state=3407,
)

dataset = load_dataset("json", data_files=str(DATA), split="train")
print(f"[ft] dataset : {len(dataset)} exemples", flush=True)

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    args=SFTConfig(
        dataset_text_field="text",       # continued-pretrain sur texte brut
        per_device_train_batch_size=1,
        gradient_accumulation_steps=8,   # batch effectif 8
        warmup_steps=10,
        num_train_epochs=EPOCHS,
        learning_rate=LR,
        logging_steps=5,
        optim="adamw_8bit",
        weight_decay=0.001,
        lr_scheduler_type="linear",
        seed=3407,
        report_to="none",
        output_dir=str(OUTDIR / "checkpoints"),
        save_strategy="no",
    ),
)

stats = trainer.train()
print(f"[ft] terminé : {stats.metrics}", flush=True)

# LoRA + (optionnel) merge + GGUF pour Ollama
model.save_pretrained(str(OUTDIR / "lora"))
tokenizer.save_pretrained(str(OUTDIR / "lora"))
print(f"[ft] LoRA sauvegardé → {OUTDIR/'lora'}", flush=True)

if os.environ.get("SAVE_GGUF") == "1":
    print("[ft] export GGUF Q8_0…", flush=True)
    model.save_pretrained_gguf(
        str(OUTDIR / "gguf"),
        tokenizer,
        quantization_method="Q8_0",
    )
    print(f"[ft] GGUF → {OUTDIR/'gguf'}", flush=True)
