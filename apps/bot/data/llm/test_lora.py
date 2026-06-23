#!/usr/bin/env python3
"""test_lora.py — charge le LoRA manga (base + adapter) et génère quelques réponses
pour juger l'effet du fine-tune avant export GGUF. Usage : ~/.unsloth/bin/python test_lora.py"""
from unsloth import FastModel

LORA = "/home/aphrody/shenron/apps/bot/data/llm/gemma4-manga/lora"

model, tokenizer = FastModel.from_pretrained(
    model_name=LORA,        # unsloth résout la base via adapter_config.json
    max_seq_length=512,
    load_in_4bit=True,
)
FastModel.for_inference(model)

prompts = [
    "Raconte la première rencontre entre Bulma et Son Goku, dans le style du manga Dragon Ball.",
    "Qui est Vegeta ? Réponds en quelques phrases.",
    "Décris le Kamehameha.",
]
for p in prompts:
    msgs = [{"role": "user", "content": [{"type": "text", "text": p}]}]
    inputs = tokenizer.apply_chat_template(
        msgs, add_generation_prompt=True, tokenize=True, return_tensors="pt", return_dict=True
    ).to("cuda")
    out = model.generate(**inputs, max_new_tokens=220, temperature=1.0, top_p=0.95, top_k=64)
    text = tokenizer.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
    print(f"\n===== {p} =====\n{text.strip()}", flush=True)

print("\n=== TEST LORA TERMINÉ ===", flush=True)
