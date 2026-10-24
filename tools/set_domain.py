"""Replace the YOUR-DOMAIN.com placeholder with your real address.
Usage (from the project root): python3 tools/set_domain.py https://usamamughal.dev"""
import sys, pathlib

domain = sys.argv[1].rstrip("/")
for name in ("index.html", "robots.txt", "sitemap.xml"):
    path = pathlib.Path(name)
    path.write_text(path.read_text().replace("https://YOUR-DOMAIN.com", domain))
    print("updated", name)
