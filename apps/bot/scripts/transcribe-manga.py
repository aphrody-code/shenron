#!/usr/bin/env python3
"""transcribe-manga.py — OCR des planches manga → markdown par tome.

PaddleOCR FR (mobile PP-OCRv5, oneDNN off), détection + reconnaissance + tri en
ordre de lecture (lignes haut→bas, gauche→droite). Parallélisé (pool de workers).
Un fichier markdown par tome dans assets/manga/transcripts/.

Usage : .ocr311/bin/python scripts/transcribe-manga.py <glob_dossiers_tomes> [--workers 10]
  ex.  : … scripts/transcribe-manga.py "assets/manga/DB/regular/vol*" --workers 10
"""
import os, sys, glob, time, re
from multiprocessing import Pool

ROOT = "/home/ubuntu/shenron/apps/bot"
OUTDIR = os.path.join(ROOT, "assets/manga/transcripts")
os.environ["FLAGS_use_mkldnn"] = "0"

OCR = None
def init_worker():
    global OCR
    # 1 thread/worker : sinon paddle prend tous les cœurs par inférence et les
    # workers se sur-souscrivent (aucun gain). Doit être posé AVANT l'import paddle.
    from paddleocr import PaddleOCR
    ct = int(os.environ.get("OCR_CPU_THREADS", "2"))
    # cpu_threads cappe les threads paddle PAR worker → N_workers × cpu_threads = cœurs,
    # vraie parallélisation sans sur-souscription (OMP/set_num_threads inopérants ici).
    OCR = PaddleOCR(enable_mkldnn=False, cpu_threads=ct,
                    text_detection_model_name="PP-OCRv5_mobile_det",
                    text_recognition_model_name="PP-OCRv5_mobile_rec",
                    use_doc_orientation_classify=False, use_doc_unwarping=False,
                    use_textline_orientation=False)

def _poly_xy(p):
    xs = [pt[0] for pt in p]; ys = [pt[1] for pt in p]
    return (min(xs)+max(xs))/2, min(ys), (min(xs)+max(xs))/2  # cx, top, cx

def reading_order(items):
    """items: list of (poly, text). Regroupe en lignes (par chevauchement vertical),
    lignes haut→bas, dans chaque ligne gauche→droite."""
    if not items: return []
    boxed = []
    for poly, text in items:
        ys = [pt[1] for pt in poly]; xs = [pt[0] for pt in poly]
        boxed.append((min(ys), max(ys), (min(xs)+max(xs))/2, text))
    boxed.sort(key=lambda b: b[0])  # par top y
    rows, cur, cur_bot = [], [], None
    for top, bot, cx, text in boxed:
        if cur and top > cur_bot - (bot-top)*0.4:  # nouvelle ligne si peu de chevauchement
            rows.append(cur); cur, cur_bot = [], None
        cur.append((cx, text)); cur_bot = max(cur_bot or bot, bot)
    if cur: rows.append(cur)
    out = []
    for row in rows:
        row.sort(key=lambda c: c[0])  # gauche→droite
        out.extend(t for _, t in row)
    return out

def ocr_page(path):
    try:
        res = OCR.predict(path)
    except Exception as e:
        return path, [f"[OCR erreur: {e.__class__.__name__}]"]
    items = []
    for r in res:
        d = r if isinstance(r, dict) else getattr(r, "json", {}).get("res", {})
        texts = d.get("rec_texts") or []
        polys = d.get("rec_polys") or d.get("dt_polys") or []
        if len(polys) != len(texts):  # fallback boxes
            polys = d.get("rec_boxes") or [[[0,0]]]*len(texts)
        for t, p in zip(texts, polys):
            try: items.append((list(p), t))
            except Exception: pass
    return path, reading_order(items)

def page_num(path):
    m = re.search(r"(\d+)\.webp$", path)
    return int(m.group(1)) if m else 0

def main():
    args = sys.argv[1:]
    workers = 10
    if "--workers" in args:
        workers = int(args[args.index("--workers")+1]); del args[args.index("--workers"):args.index("--workers")+2]
    patterns = args  # tous les positionnels = globs de dossiers-tomes
    tomes = []
    for p in patterns:
        tomes += glob.glob(os.path.join(ROOT, p))
    tomes = sorted(set(t for t in tomes if os.path.isdir(t)))
    os.makedirs(OUTDIR, exist_ok=True)
    # Idempotent : saute les tomes dont le markdown existe déjà.
    def _md_path(tdir):
        name = os.path.basename(tdir.rstrip("/"))
        series = tdir.split("/assets/manga/")[1].split("/")[0]
        return os.path.join(OUTDIR, f"{series}-{name}.md")
    tomes = [t for t in tomes if not os.path.exists(_md_path(t))]
    print(f"[OCR] {len(tomes)} tomes à faire, {workers} workers", flush=True)

    total = sum(len(glob.glob(os.path.join(t, "*.webp"))) for t in tomes)
    print(f"[OCR] {total} planches au total", flush=True)

    # Pool persistant ; traitement TOME PAR TOME → écriture incrémentale (robuste
    # aux interruptions sur un job long) + idempotent (un tome écrit n'est pas refait).
    t0 = time.time(); done = 0
    with Pool(workers, initializer=init_worker) as pool:
        for tdir in tomes:
            name = os.path.basename(tdir.rstrip("/"))
            series = tdir.split("/assets/manga/")[1].split("/")[0]
            pages = sorted(glob.glob(os.path.join(tdir, "*.webp")), key=page_num)
            res = {}
            for path, lines in pool.imap_unordered(ocr_page, pages, chunksize=2):
                res[path] = lines; done += 1
                if done % 50 == 0:
                    el = time.time() - t0
                    print(f"[OCR] {done}/{total} ({el:.0f}s, {done/el:.2f} p/s, ~{(total-done)*el/done/3600:.1f}h restant)", flush=True)
            md = [f"# {series} — {name}\n"]
            for pg in pages:
                ls = res.get(pg, [])
                if not ls: continue
                md.append(f"\n## Planche {page_num(pg):03d}\n")
                md.append("\n".join(f"- {l}" for l in ls if l.strip()))
            out = os.path.join(OUTDIR, f"{series}-{name}.md")
            with open(out, "w") as f: f.write("\n".join(md))
            print(f"[OCR] ✓ {series}-{name} ({sum(len(res.get(p,[])) for p in pages)} lignes)", flush=True)

    print(f"[OCR] TERMINÉ en {time.time()-t0:.0f}s", flush=True)

if __name__ == "__main__":
    main()
