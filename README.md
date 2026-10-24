# Portfolio

Static portfolio site. No build step, no dependencies.

## Structure

```
index.html          Page skeleton and static text (hero, headings)
css/tokens.css      Colors, fonts, light/dark themes
css/style.css       Layout and components
js/data.js          All content: profile, projects, experience, skills (edit this most often)
assets/             CV PDF
tools/to_webp.py    Optional: convert screenshots to WebP
js/main.js          Rendering logic (no content)
images/projects/    One folder per project for screenshots
```

## Add a project

1. Create `images/projects/<project-name>/` and add screenshots (PNG or WebP, about 1080x2340).
2. Name the screenshots `01.png`, `02.png`, `03.png`... in that folder.
3. Copy a block in `js/data.js` and fill it in. For 5 screenshots use:
   `shots: screenshots("my-app", 5)`
   For WebP or JPG add the extension: `screenshots("my-app", 5, "webp")`.
   You can also list paths by hand, in any order.
4. Refresh the page.

## Change the look

Edit variables in `css/tokens.css`. `--accent` is the highlight color, `--bg` and `--surface` set the backgrounds.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Deploy

Push the folder to GitHub and enable Pages, or drag it into Netlify.

## Other settings

- Hero photo: set `PROFILE.photo` in `js/data.js` (e.g. `images/me.jpg`). Empty shows a phone with your lead project.
- Project links: `links: [{ label: "Play Store", url: "https://..." }]`. Without links, `note` is shown.
- App icon: set `icon` to an image path. Empty shows a letter badge in the app's `color`.
- CV: replace `assets/Usama_CV_2026.pdf`, or set `PROFILE.cv` to `""` to hide the button.
- Link previews on WhatsApp/LinkedIn need an absolute `og:image` URL in `index.html` after you deploy.

## Case studies

Each project can have a `caseStudy` block in `js/data.js` with `problem`, `role`, `decisions` (title and text) and `result`. Leave `result: ""` to hide that section. Only write results you can prove (real numbers, real usage). Visitors can share a direct link such as `yoursite.com/#case-al-muqeet-milk`.

## Contact form (Formspree, free)

1. Create an account at formspree.io and make a new form with your email address.
2. Copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `formEndpoint` in `js/data.js`.

Until then, the form opens the visitor's email app with the message filled in.

## Deploy

**GitHub Pages (free):** push this folder to a GitHub repository on the `main` branch, then in the repository go to Settings > Pages and set Source to "GitHub Actions". The included workflow publishes the site on every push.

**Netlify or Vercel:** drag the folder in, or connect the repository. No build settings are needed.

**Custom domain:** buy a domain, add it in your host's settings, then follow the host's DNS instructions. On GitHub Pages you can also add a file named `CNAME` containing only your domain.

**After you know your address**, run this once from the project root:

```
python3 tools/set_domain.py https://yourdomain.com
```

It fills in the canonical link, link-preview image URL, `robots.txt` and `sitemap.xml`. Replace `assets/og-image.png` with your own 1200x630 image if you like.
