# portfolio-website

Personal portfolio — pure HTML, CSS, JS. No frameworks, no build step.

**Live:** [chakradharv.dev](https://chakradharv.dev)

---

## Features

- Dark/light theme toggle — persists via `localStorage`, no flash on load
- Auto-fetches and renders projects from GitHub API
- Scroll-reveal animations via `IntersectionObserver`
- Active nav highlight on scroll
- Fully responsive — mobile and desktop
- Zero dependencies — no React, no Tailwind, no Bootstrap

---

## Stack

| Layer | Choice |
|-------|--------|
| Markup | HTML5 — semantic, no divitis |
| Styling | CSS3 — custom properties, flexbox, grid, keyframe animations |
| Logic | JavaScript ES6 — no bundler |
| Fonts | Inter + JetBrains Mono via Google Fonts |
| Hosting | GitHub Pages + custom domain via name.com |

---

## Structure

```
portfolio-website/
├── index.html      # Structure and content
├── style.css       # All styling, theming, animations
├── script.js       # Theme toggle, scroll reveal, nav highlight, GitHub API
├── CNAME           # chakradharv.dev
└── README.md
```

---

## Theming

Light and dark mode share the same design language — same typography, spacing, and component shapes. Switching is done via `data-theme="light"` on `<html>`, toggled by a button in the nav. Preference is saved to `localStorage` and applied via an inline `<script>` in `<head>` before first paint to prevent flash.

Dark palette — `#0a0a0a` base, `#e8e8e8` text, `#4ade80` accent  
Light palette — `#f5f5f4` base, `#1a1a1a` text, `#16a34a` accent

---

## Projects Section

Projects are fetched live from the GitHub API (`/users/chakri192/repos`) — no manual updates needed when new repos are pushed. Forks and the profile/portfolio repos are filtered out. Language dot colors and topic tags are rendered per repo.

---

## Run Locally

```bash
git clone https://github.com/chakri192/portfolio-website.git
cd portfolio-website
open index.html
```

No build step. No `package.json`.

---

## AI Tooling

| Model | Used for |
|-------|----------|
| `qwen2.5-coder:7b` | Code suggestions, refactoring |
| `llama3.1:8b` | Prose, documentation, commit messages |

---

## Author

**V Chakradhar** · [github.com/chakri192](https://github.com/chakri192) · [linkedin.com/in/1chakradhar-v1](https://linkedin.com/in/1chakradhar-v1)  
1st Year CSE · SEACET, VTU · Bengaluru
