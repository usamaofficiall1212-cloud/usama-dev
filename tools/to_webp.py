"""Convert PNG/JPG screenshots in a folder to WebP, plus a narrow gallery variant.
Usage: pip install pillow && python3 tools/to_webp.py images/projects/al-muqeet-milk
Then use screenshots("al-muqeet-milk", 7, "webp") in js/data.js.

For every 01.png this writes:
  01.webp      full size, used by the lightbox
  01-720.webp  max 720px wide, used by the phone gallery via srcset
"""
import sys, pathlib
from PIL import Image

GALLERY_WIDTH = 720

if len(sys.argv) < 2:
    sys.exit(__doc__)

for f in sorted(pathlib.Path(sys.argv[1]).iterdir()):
    if f.suffix.lower() not in (".png", ".jpg", ".jpeg"):
        continue

    with Image.open(f) as img:
        img = img.convert("RGB")
        full = f.with_suffix(".webp")
        img.save(full, quality=82, method=6)

        width = min(GALLERY_WIDTH, img.width)
        height = round(img.height * width / img.width)
        thumb = img.resize((width, height), Image.LANCZOS)
        thumb_path = f.with_name(f"{f.stem}-{GALLERY_WIDTH}.webp")
        thumb.save(thumb_path, quality=80, method=6)

    print(f"saved {full.name} ({full.stat().st_size // 1024} KB), "
          f"{thumb_path.name} ({thumb_path.stat().st_size // 1024} KB)")
