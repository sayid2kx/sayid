# Sarowar Jahan Sayid — Portfolio (Next.js)

Personal portfolio for **Sarowar Jahan Sayid** — Computer Science graduate (Netrokona University) turned entrepreneur managing **Shahin Machinery and Hardware Store** in Mymensingh, Bangladesh. Built as a static-export Next.js app for GitHub Pages and Vercel.

**Live (Vercel):** https://sayid-xyz.vercel.app/ · **GitHub Pages:** https://sayid2kx.github.io/ · **Email:** sayid2kx@gmail.com · **Location:** B.O.C More, Ray Bazar, Atharabari, Mymensingh

> This `next-app/` is the Next.js 16 rewrite of the vanilla HTML/CSS/JS portfolio at the repo root (`/index.html`). Both render the same content; this app adds theming, motion, and a shadcn/ui component system with `output: export` for static hosting.

## Features

- **Single-page portfolio** with 7 sections: Hero, About, Gallery (Life In Frames), Journey, Education, Store, Contact + footer
- **4-theme system** — Garden (default, conic-gradient + blobs), Cupertino (Apple `f5f5f7` / `#0071e3`), Paper (cream `#fdfcf8` / terracotta `#c75a3a`), Studio (Swiss white/black) — persisted via `localStorage` + `data-theme` attribute, FOUC-safe inline script in `src/app/layout.tsx:69`
- **Gallery lightbox** — 7 images (`public/assets/sayid1-7.jpg`) in a responsive 1→2→3 grid, captions swap per theme, click-to-open `Dialog` with fit-to-viewport (`max-h-[92vh]`) — `src/app/page.tsx:44`
- **Journey timeline** — CS Student (2020–2025) → Web Development (2025) → Hardware Business Owner (2026–present) with icon + badge tags
- **Framer Motion** — hero `initial/animate`, gallery `whileInView` stagger, blobs `move` keyframes, `AnimatePresence` scroll-to-top button
- **Scroll-aware nav** — floating pill after `scrollY > 20`, desktop links + mobile `Sheet` drawer, smooth `scrollIntoView`, per-section `scroll-mt-24`
- **Responsive & accessible** — `viewportFit: cover`, `overflow-x-hidden` with `@supports` clip fallback, semantic landmarks, `aria-label`/`aria-pressed`, `Dialog`/`Sheet` focus traps

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16.3.3](https://nextjs.org) App Router, `output: "export"` (`next.config.ts:4`), `images.unoptimized: true` |
| Language | TypeScript 5 (strict, `@/*` → `./src/*`) |
| UI | React 19.2, [shadcn/ui](https://ui.shadcn.com) `base-nova` + `neutral` (`components.json:3`), Tailwind CSS 4 + `@tailwindcss/postcss`, `tw-animate-css` |
| Components | `src/components/ui/*` — `button.tsx`, `card.tsx`, `badge.tsx`, `separator.tsx`, `avatar.tsx`, `sheet.tsx`, `dialog.tsx` (backed by `@base-ui/react`) |
| Animation | `framer-motion` 13 |
| Icons | `lucide-react` + inline SVG for Facebook/X |
| Fonts | `next/font/google` — Inter (`--font-inter`), Instrument Serif (`--font-instrument`), JetBrains Mono (`--font-jetbrains`) — `src/app/layout.tsx:12` |
| Utils | `clsx` + `tailwind-merge` via `cn()` (`src/lib/utils.ts:4`), `class-variance-authority` |
| Lint | `eslint` + `eslint-config-next` |

## Project Structure

```
next-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # metadata, viewport, fonts, theme hydration script, shell
│   │   ├── page.tsx        # single client component: all sections, state, themes, gallery
│   │   ├── globals.css     # Tailwind + shadcn tokens + 4 theme blocks + animations
│   │   └── favicon.ico
│   ├── components/ui/      # shadcn primitives (button, card, badge, separator, sheet, dialog, avatar)
│   └── lib/utils.ts        # cn() helper
├── public/assets/          # Sayid.jpg, sayid1-7.jpg, favicon.svg
├── components.json         # shadcn config (style: base-nova, rsc, aliases)
├── next.config.ts          # output: export, images.unoptimized, basePath note
├── tsconfig.json           # paths @/*, bundler resolution
└── out/                    # static export after `next build` (gitignored)
```

## Design System & Theming

Tokens live in `src/app/globals.css:52`. Each theme overrides CSS variables:

| Theme | `data-theme` | Background | Accent | Radius | Blobs | Caption BG |
|---|---|---|---|---|---|---|
| Garden | `garden` | `#f0f4f8` | `#52b788` | `0.875rem` | `0.22` | `#1f3b2f` |
| Cupertino | `cupertino` | `#f5f5f7` | `#0071e3` | `1.125rem` | `0` | `#0071e3` |
| Paper | `paper` | `#fdfcf8` | `#c75a3a` | `1rem` | `0` | `#c75a3a` |
| Studio | `studio` | `#ffffff` | `#000000` | `1.25rem` | `0` | `#000000` |

- Switcher: desktop dock fixed bottom-center (`page.tsx:934`) + mobile `Sheet` grid (`page.tsx:216`). Writes to `localStorage:portfolio-theme` and `document.documentElement[data-theme]`.
- Gallery captions keyed by theme in `galleryCaptions` (`page.tsx:54`).
- Footer `background: var(--footer-bg)` and main border `background: var(--main-gradient)` swap per theme.

## Getting Started

Prerequisites: Node.js 18.18+ or 20+ (Next.js 16 requirement), npm/yarn/pnpm/bun.

```bash
# from repo root
cd next-app

npm install
npm run dev      # http://localhost:3000

# other scripts
npm run build    # next build → static export to out/
npm run start    # serve production build (not needed for export)
npm run lint     # eslint
```

Edit content in `src/app/page.tsx` (sections are co-located: `themes`, `navLinks`, `gallery`, `galleryCaptions`, page component). Tokens and theme overrides in `src/app/globals.css`. Global metadata in `src/app/layout.tsx:31`.

## Deployment

This app supports both **Vercel** (recommended) and **GitHub Pages** (static export).

### Vercel — https://sayid-xyz.vercel.app/

Deploys directly from this `next-app/` directory — no extra config needed. Vercel auto-detects Next.js, runs `next build`, and handles SSR/ISR + image optimization. For static export compatibility keep `output: "export"` and `images.unoptimized: true` (`next.config.ts:4`); or remove `output: "export"` to enable Vercel's server features.

```bash
# via Vercel CLI
vercel --prod
# or push to GitHub and import `next-app` as project root in vercel.com dashboard
```

### GitHub Pages — https://sayid2kx.github.io/

`next.config.ts:4` uses `output: "export"` + `images.unoptimized: true` so `next build` emits a fully static `out/` directory.

```bash
npm run build    # produces out/
# deploy out/ to gh-pages (e.g. via peaceiris/actions-gh-pages or `gh-pages` branch)
```

For a project site (`username.github.io/repo-name`) set `basePath: "/repo-name"` in `next.config.ts:7`. For the user site `sayid2kx.github.io` (repo `sayid2kx.github.io`) no `basePath` is needed — current config is correct.

If you keep the vanilla `index.html` at the repo root, configure Pages to serve from `next-app/out` (GitHub Actions workflow) or publish the `next-app` build separately — don't mix the two site roots.

## Customization

- **Content:** update `gallery`, `navLinks`, journey/education/store arrays in `src/app/page.tsx`.
- **Images:** replace files in `public/assets/` (keep names or update `src` paths; `next/image` is `unoptimized` for export).
- **Theme colors:** edit `:root` and `[data-theme="*"]` blocks in `globals.css` — `--accent`, `--footer-bg`, `--main-gradient`, `--blob-opacity`, `--grain-opacity`.
- **Shadcn components:** `npx shadcn@latest add <component>` — aliases resolved via `components.json:15` / `tsconfig.json:22`.
- **SEO:** `metadata` + `openGraph` + `twitter` in `src/app/layout.tsx:31`.

## Sections in Detail

1. **Hero** — `CS Graduate → Hardware Business Owner` badge, name with accent underline, location pill, CTA to `#contact`, social links (Facebook, X, Email), circular portrait (`/assets/Sayid.jpg`).
2. **About** — card with "Technology Mindset, Business Focus" + stats (3+ Product Areas, 2026 Business Focus, family business bar).
3. **Gallery** — 7-image grid + numbered badge + themed caption bar + lightbox `Dialog`.
4. **Journey** — vertical timeline with `GraduationCap` / `FileText` / `Store`.
5. **Education** — Netrokona University (B.Sc CS, 2020–2025), ARMC Mymensingh (H.S.C 4.50), Atharabari M.C High School (S.S.C 4.73).
6. **Store** — Industrial Machinery, Cycle Parts & Accessories, General Hardware — with tag badges.
7. **Contact** — address (B.O.C More, Ray Bazar), email, business hours (Everyday 9:30 AM–11:30 PM).
8. **Footer** — per-theme `var(--footer-bg)`, social row, visit block, copyright year (`useState` + `getFullYear()`).

## Related

- Vanilla portfolio at repo root — `../index.html`, `../style.css`, `../script.js`, `../README.md` — zero-dependency, no build step.
- Assets shared via `public/assets/` (Next.js) and `../assets/` (vanilla).

## License

No explicit license file. Defaults to all rights reserved — contact the author for reuse.

---

Live at [sayid-xyz.vercel.app](https://sayid-xyz.vercel.app/) and [sayid2kx.github.io](https://sayid2kx.github.io) — built with Next.js, Tailwind, shadcn/ui, and Framer Motion.
