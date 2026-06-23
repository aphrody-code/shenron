#!/usr/bin/env python3
"""prepare_manga_data.py — Dataset de fine-tuning (continued-pretrain) à partir des
transcriptions OCR manga BRUTES (assets/manga/transcripts/*.md), avec un nettoyage
TRAINING agressif (bien plus strict que le RAG) : on DROP le bruit qui pollue le
modèle — watermarks de scanlation (SCANTRAD.NET, BLEACH-MX, voiranime…), timestamps,
dates, numéros de page, crédits (EDITION/TRAD/CLEAN/RAW), et garbage OCR (lignes à
forte densité de chiffres/symboles, suites de tokens alphanumériques courts).
On garde le dialogue/narration FR + le japonais (kana/kanji = mot).

Sortie : data/llm/manga_pretrain.jsonl ({"text": ...} par planche).
Usage : ~/.unsloth/bin/python apps/bot/data/llm/prepare_manga_data.py
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent                    # apps/bot/data/llm
TDIR = HERE.parent.parent / "assets" / "manga" / "transcripts"
OUT = HERE / "manga_pretrain.jsonl"

CJK = re.compile(r"[぀-ヿ一-鿿]")
LETTER = re.compile(r"[A-Za-zÀ-ÿぁ-んァ-ヶ一-鿿]")

# Lignes entièrement DROPPÉES (bruit qui contamine le fine-tune).
NOISE = re.compile(
    r"(www\.|https?://|\.(net|fr|com|org|io)\b|scantrad|bleach[\s_-]*mx|voiranime|"
    r"\bedition\b|edizioni|co[mh]ics|\btrad\b|\bclean\b|\braw\b|jump\s*comics|"
    r"star\s*co[mh]ics|fullcolor|sommaire|\bisbn\b|toriyama|akira|"
    r"\d{1,2}\s*[:hH]\s*\d{2}|\d{4}[-/.]\d{2}[-/.]\d{2}|\d{2}[-/.]\d{2}[-/.]\d{2,4}|"
    r"chapitre\s+[oilOIL0-9]{1,4}\s*:|\bpage\s*\d|©|™)",
    re.I,
)
SHORT_ALNUM = re.compile(r"^(?:[0-9][A-Za-z0-9]{0,3}|[A-Za-z][0-9]+|[0-9]+[eE])$")


def clean_line(raw: str) -> str | None:
    t = re.sub(r"^[-*]\s*", "", raw).replace("　", " ")
    t = re.sub(r"\s+", " ", t).strip()
    if not t or NOISE.search(t):
        return None
    compact = re.sub(r"\s", "", t)
    letters = len(LETTER.findall(t))
    if not compact or letters < 2 or letters / len(compact) < 0.6:
        return None  # trop de chiffres/symboles → garbage OCR
    toks = t.split()
    if toks and sum(1 for w in toks if SHORT_ALNUM.match(w)) > len(toks) / 2:
        return None  # suites de tokens alphanumériques courts (ex. "1a2c 1e2f 1O")
    return t


def main() -> None:
    examples = []
    n_jp = 0
    for md in sorted(TDIR.glob("*.md")):
        base = md.stem
        series = base.split("-")[0]
        tome = "-".join(base.split("-")[1:])
        raw = md.read_text(encoding="utf-8")
        parts = re.split(r"\n##\s+Planche\s+(\d+)\s*\n", raw)
        for i in range(1, len(parts), 2):
            num = parts[i]
            lines = [c for c in (clean_line(x) for x in parts[i + 1].split("\n")) if c]
            body = " ".join(lines)
            if len(body) < 40:
                continue
            if CJK.search(body):
                n_jp += 1
            examples.append({"text": f"{series} {tome}, planche {num} :\n{body}"})

    with OUT.open("w", encoding="utf-8") as f:
        for ex in examples:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")
    chars = sum(len(e["text"]) for e in examples)
    print(f"✓ {OUT.name} : {len(examples)} exemples ({n_jp} avec JP), ~{chars // 1000}k caractères")


if __name__ == "__main__":
    main()
