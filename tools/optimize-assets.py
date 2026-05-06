"""OPT-5: convert PNG > 200KB in assets/ to WebP q=85, delete original."""
import os, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "assets"
THRESHOLD = 200 * 1024
SKIP_DIRS = {"textures"}

total_before = 0
total_after = 0
converted = 0
skipped = 0

for png in ROOT.rglob("*.png"):
    if any(part in SKIP_DIRS for part in png.relative_to(ROOT).parts):
        continue
    size = png.stat().st_size
    if size <= THRESHOLD:
        skipped += 1
        continue
    webp = png.with_suffix(".webp")
    img = Image.open(png)
    img.save(webp, "WEBP", quality=85, method=6)
    new_size = webp.stat().st_size
    total_before += size
    total_after += new_size
    converted += 1
    png.unlink()
    print(f"{png.relative_to(ROOT)}: {size//1024}KB -> {new_size//1024}KB")

print(f"\nConverted: {converted}, skipped (<=200KB): {skipped}")
print(f"Total: {total_before//1024}KB -> {total_after//1024}KB "
      f"(saved {(total_before-total_after)//1024}KB, "
      f"{100*(total_before-total_after)/max(total_before,1):.1f}%)")
