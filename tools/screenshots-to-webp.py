# screenshots-to-webp.py — конвертирует docs/screenshots/**/*.png в .webp (quality 82).
# Требует Pillow с поддержкой WebP. Запуск: python tools/screenshots-to-webp.py
# Оригиналы .png НЕ удаляет — удали вручную после проверки результата.
import os, glob
from PIL import Image

root = os.path.join(os.path.dirname(__file__), "..", "docs", "screenshots")
root = os.path.abspath(root)
pngs = glob.glob(os.path.join(root, "**", "*.png"), recursive=True)

total_before = 0
total_after = 0
print(f"Found {len(pngs)} PNG files under {root}\n")
for p in sorted(pngs):
    out = p[:-4] + ".webp"
    before = os.path.getsize(p)
    im = Image.open(p).convert("RGB") if Image.open(p).mode == "P" else Image.open(p)
    # quality 82, method 6 (max compression effort) — good for UI screenshots
    im.save(out, "WEBP", quality=82, method=6)
    after = os.path.getsize(out)
    total_before += before
    total_after += after
    rel = os.path.relpath(p, root)
    print(f"{rel:42s} {before//1024:5d}KB -> {after//1024:4d}KB  ({100*after//before}%)")

print(f"\nTOTAL: {total_before//1024}KB -> {total_after//1024}KB "
      f"({100*total_after//total_before}% of original, saved {(total_before-total_after)//1024}KB)")
