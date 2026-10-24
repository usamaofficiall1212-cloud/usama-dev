"""Convert PNG/JPG screenshots in a folder to smaller WebP files.
Usage: pip install pillow && python3 tools/to_webp.py images/projects/al-muqeet-milk
Then use screenshots("al-muqeet-milk", 7, "webp") in js/data.js."""
import sys, pathlib
from PIL import Image

for f in sorted(pathlib.Path(sys.argv[1]).iterdir()):
    if f.suffix.lower() in (".png", ".jpg", ".jpeg"):
        out = f.with_suffix(".webp")
        Image.open(f).convert("RGB").save(out, quality=82)
        print("saved", out)
