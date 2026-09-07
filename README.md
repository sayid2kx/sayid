# Sarowar Jahan Sayid — Portfolio (Next.js)

Personal portfolio for **Sarowar Jahan Sayid** — CS graduate (Netrokona University) turned entrepreneur at **Shahin Machinery and Hardware Store**, Mymensingh. Static-export Next.js app for GitHub Pages & Vercel.

**Live:** [sayid-xyz.vercel.app](https://sayid-xyz.vercel.app/) · [sayid2kx.github.io](https://sayid2kx.github.io/) · **Email:** sayid2kx@gmail.com

> `next-app/` is the Next.js 16 rewrite of the vanilla site at the repo root (`/index.html`). Same content, plus theming, motion, and shadcn/ui.

## Features

- **9 sections:** Hero, **Learning Simulation**, About, Gallery (Life In Frames), Journey, **GitHub (On GitHub)**, Education, Store, Contact + footer
- **GitHub** (`src/components/GitHubProfile.tsx:1`) — live profile card for `sayid2kx` via client-side `api.github.com/users/sayid2kx` (static-export safe). Avatar, bio, location/company, Repos/Followers/Following stats, Live/Cached badge, skeleton + cached fallback with retry, plus contribution graph (`ghchart.rshah.org/sayid2kx`, lazy `<img>`). Section `id="github"` between Journey and Education, nav link included.
- **Learning Simulation** (`src/components/LearningSimulation.tsx:1`) — centered canvas between Hero and About, no surrounding text. Animated head/shoulders silhouette with 4 icon sources (book/code/tools/idea) and comet particles along quadratic bezier threads. Theme-aware palette via `palette` (Garden `#52b788`, Flux `#7c3aed`, etc.), DPR-aware, `ResizeObserver` + `IntersectionObserver` pause, `prefers-reduced-motion` support. Mobile responsive: `aspect-[1.15/1] sm:aspect-[1.52/1]`, inset adjustment for `<420px`/` <360px`, `minHeight 220`.
- **5 themes** — Garden (default), **Flux** (interactive), Cupertino (Apple), Paper (warm), Studio (Swiss) — persisted via `localStorage` + `data-theme`, FOUC-safe script in `src/app/layout.tsx:69`
- **Flux** — light concourse theme with aurora mesh, grid, scroll progress, custom cursor (desktop), magnetic hover, hero tilt (3D), and gallery enhancements
- **Gallery:** 7 images (`public/assets/sayid1-7.jpg`). Grid (4 themes) / **draggable snap carousel** (Flux) with edge fades, arrows, and drag-to-scroll. Themed captions + click-to-open `Dialog` lightbox
- **Motion:** Framer Motion hero, staggered reveals, timeline & card entrances, `AnimatePresence` scroll-to-top
- **Nav:** floating pill after `scrollY > 20`, desktop links + mobile `Sheet`, smooth `scrollIntoView`

Hero has no CTA buttons — social links only (Facebook, X, GitHub, Email).

## Tech Stack

Next.js 16.3.3 (App Router, `output: "export"`), React 19.2, TypeScript 5, Tailwind CSS 4, shadcn/ui `base-nova` + `neutral`, Framer Motion 13, lucide-react, `next/font` (Inter / Instrument Serif / JetBrains Mono).

## Project Structure

```
src/app/
  layout.tsx              # metadata, viewport, fonts, theme hydration
  page.tsx                # all sections (incl. simulation), themes, gallery, Flux interactions
  globals.css             # tokens + 5 theme blocks + Flux aurora/cursor/carousel
src/components/
  LearningSimulation.tsx  # canvas simulation (centered, theme-aware, responsive)
  GitHubProfile.tsx       # live GitHub profile + contribution graph (client-side)
  ui/                     # button, card, badge, separator, sheet, dialog, avatar
public/assets/            # Sayid.jpg, sayid1-7.jpg, favicon.svg
next.config.ts            # output: export, images.unoptimized
```

## Theming

Tokens in `src/app/globals.css:52`. Each `[data-theme]` overrides CSS variables.

| Theme | Background | Accent | Radius | Effect |
|---|---|---|---|---|
| Garden | `#f0f4f8` | `#52b788` | `0.875rem` | blobs |
| **Flux** | `#fcfcff` | `#7c3aed` | `1.125rem` | aurora + grid + glow |
| Cupertino | `#f5f5f7` | `#0071e3` | `1.125rem` | — |
| Paper | `#fdfcf8` | `#c75a3a` | `1rem` | — |
| Studio | `#ffffff` | `#000000` | `1.25rem` | — |

Switcher: desktop dock (bottom-center) + mobile Sheet. Gallery captions keyed by theme in `galleryCaptions`.

## Getting Started

Requires Node 18.18+ or 20+.

```bash
cd next-app
npm install
npm run dev      # http://localhost:3000
npm run build    # → out/ (static export)
npm run lint
```

Edit content in `src/app/page.tsx` (`gallery`, `navLinks`, journey/education/store arrays). Colors & gradients in `globals.css` `[data-theme]`.

## Deployment

**Vercel** — import `next-app` as project root, no extra config.

**GitHub Pages** — `next.config.ts` uses `output: "export"` + `images.unoptimized`, so `npm run build` emits `out/` for Pages. For `username.github.io/repo-name` set `basePath: "/repo-name"`; for user site `sayid2kx.github.io` no `basePath` needed.

## License

No explicit license — all rights reserved. Contact the author for reuse.
