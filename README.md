# Abdul Mannan — Portfolio

Personal portfolio of **Abdul Mannan**, Senior Backend Developer (FastAPI · Django · Kubernetes · AWS) based in Lahore, Pakistan.

**Live site:** [www.abdul-mannan.com](https://www.abdul-mannan.com)

A fast, dependency-free static site built with plain HTML, CSS and JavaScript. There's no framework and no build step. It loads only ~0.4 MB of images and works on phones, tablets and desktops in dark and light themes.

## Sections

| Section | What it shows |
|---|---|
| **Hero** | Headline, rotating specialties, CV download, and an animated "deploy" terminal |
| **Impact** | Count-up stats: 3+ years, 30% faster APIs, 10× peak traffic, 70% less release effort |
| **Services** | Backend architecture · DevOps & cloud · Performance & observability · Security & integrations |
| **Experience** | Timeline: Crypthon Technologies, Revocode, BlitzCoFluence |
| **Projects** | GrabnGo, Laen Daen, Hunger Delights: product overview, what I built, store links |
| **Skills** | Grouped toolbox, with daily-use tools highlighted |
| **About** | Portrait, background, education and quick facts |
| **Contact** | Email, copy-email button, phone, WhatsApp, LinkedIn, GitHub, CV |

## Features

- **Design:** deep navy with an indigo → cyan gradient accent; Plus Jakarta Sans and JetBrains Mono fonts
- **Themes:** follows the system dark or light setting, with a toggle that remembers your choice
- **Animation:** typing terminal, count-up numbers, tech marquee, scroll reveals, spotlight hover cards, timeline progress and a scroll progress bar
- **Accessibility:** semantic HTML, skip link, keyboard focus styles, and motion turned off for users who choose reduced motion
- **SEO and sharing:** meta and Open Graph tags, a 1200×630 share card, `Person` structured data, a sitemap and a robots file
- **Performance:** WebP images with JPG fallback, lazy loading, no JS libraries

## Project structure

```
.
├── index.html            # All page content
├── style.css             # Styles: tokens, themes, layout, responsive rules
├── main.js               # Theme toggle, menu, animations, copy-email
├── robots.txt
├── sitemap.xml
└── src/
    ├── pdf/Abdul-Mannan-CV.pdf
    ├── png/              # Favicons + original banner photo (source file)
    └── webp/             # Optimised portrait, project screenshots, logos, share card
```

## Run locally

Serve the folder with any static server, then open http://localhost:8000:

```bash
python -m http.server 8000
# or
npx serve .
```

## Editing content

- **Text, links, projects:** edit `index.html`. Each section is marked with a `<!-- ===== SECTION ===== -->` comment.
- **Colours:** change the tokens at the top of `style.css` (`--accent`, `--accent-2`, `--grad`, …). Dark and light values are defined separately.
- **Terminal animation and rotating specialties:** edit the `script` and `specialties` arrays in `main.js`.
- **CV:** replace `src/pdf/Abdul-Mannan-CV.pdf` and keep the same file name.

### Cache busting

`index.html` loads `style.css?v=…` and `main.js?v=…`. After changing either file, **increase its version number** so visitors' browsers load the new copy instead of a cached one.

### Images

Keep page images small. Resize to the size they're shown at and save as WebP, for example:

```python
from PIL import Image
im = Image.open("screenshot.png").convert("RGB")
im.thumbnail((1200, 1200))
im.save("src/webp/screenshot.webp", "WEBP", quality=82, method=6)
```

## Branches

- `main`: the current site
- `backup/original-design`: the previous design, kept for reference

## Contact

- Email: [mannanforge@gmail.com](mailto:mannanforge@gmail.com)
- LinkedIn: [mannan-software-engineer](https://www.linkedin.com/in/mannan-software-engineer)
- GitHub: [mannan-software-engineer](https://github.com/mannan-software-engineer)

## License

MIT, see [LICENSE](./LICENSE).
