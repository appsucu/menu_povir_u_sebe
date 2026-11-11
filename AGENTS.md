# Repository Guidelines

## Project Structure & Module Organization

This is a static catering menu. The published site lives in `dist/`: edit `index.html` for content and markup, `style.css` for presentation, and `menu.js` for navigation, search, and PDF interaction. `menu.json` holds structured dish data; keep names, prices, and images consistent with the HTML and its embedded JSON-LD. Put images and local WOFF2 fonts in `dist/assets/`. `scripts/download_fonts.py` refreshes the Fixel fonts. `.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages. There is no separate build output or source tree.

## Build, Test, and Development Commands

- `python3 -m http.server 8000 --directory dist` serves the site at `http://localhost:8000`.
- `python3 -m json.tool dist/menu.json >/dev/null` checks the menu data syntax.
- `node --check dist/menu.js` checks JavaScript syntax if Node.js is installed.
- `python3 scripts/download_fonts.py` downloads or validates the two Fixel fonts and updates their CSS URLs; run it only when changing font assets.

There is no package manager, build command, or automated test suite. Commits to `main` or `staging` trigger the Pages workflow; the workflow always deploys `main` at the site root and, when present, `staging` under `/staging/`.

## Coding Style & Naming Conventions

Follow nearby formatting: HTML and CSS use tabs; JavaScript uses two spaces and single quotes; JSON uses two spaces. Use semantic HTML, CSS custom properties in `:root`, and plain browser JavaScript without adding a framework. Keep category IDs in the `category-...` form and dish images in the `dish-N.webp` pattern, with `-400.webp` variants where used. Preserve Ukrainian interface copy and useful `alt` text.

## Testing Guidelines

After edits, run the relevant syntax checks above and inspect the served site at mobile and desktop widths. Check category navigation, keyboard focus, search results and URL query handling, image loading, and the PDF button when those areas change. No test naming convention or coverage target is currently defined.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Optimize page load` and `Fix footer width`; `ci:` appears for workflow changes. Keep each commit focused. In pull requests, describe the visible change, list manual checks, link any related issue, and include before/after screenshots for layout changes. Note any menu data or asset updates explicitly.
