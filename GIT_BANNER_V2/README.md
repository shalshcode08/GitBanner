# GitBanner

Generate beautiful GitHub profile banners — contribution graphs, stats, and pinned repos — sized for Twitter/X and LinkedIn.

---

## Features

- **Three banner types**
  - GitHub Contributions — full contribution graph
  - GitHub Stats — stars, commits, PRs, issues, and more
  - GitHub Pinned Repositories — your pinned repos at a glance
- **Two platform formats** — Twitter/X (1500 × 500) and LinkedIn (1584 × 396)
- **Dark / Light banner theme** — independent of the app UI theme
- **Color palettes** — swap contribution cell and stat accent colors client-side with zero extra network requests (Default, Red, Blue, Pink, Violet, Magenta, Gray)
- **PNG download** — banners are converted from SVG to PNG on the fly via canvas before download
- **Username persistence** — saved to localStorage for 7 days; editable at any time via the pencil icon in the header
- **App-level error boundary** — unexpected render errors show a recovery screen instead of a blank page
- **404 page** — clean fallback for unmatched routes

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui (Radix UI) |
| Routing | React Router v7 |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library |
| Package manager | Bun |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0

### Install

```bash
bun install
```

### Environment

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the git-banner backend | `https://git-banner-prod.up.railway.app` |

### Dev server

```bash
bun run dev
```

### Production build

```bash
bun run build
```

### Preview build

```bash
bun run preview
```

---

## Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start the Vite dev server |
| `bun run build` | Type-check + production build |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format all files with Prettier |
| `bun run test` | Run all Vitest tests once |
| `bun run test:watch` | Run Vitest in watch mode |
| `bun run test:coverage` | Generate V8 coverage report |

---

## Project Structure

```
src/
├── api/               # Backend API client (getBannerUrl, validateUsername)
├── appComponents/     # Feature components (Dashboard, Sidebar, Modals)
├── components/
│   ├── ui/            # shadcn/ui primitives (auto-generated, not linted)
│   └── ErrorBoundary  # App-level error boundary
├── context/           # DashboardContext (username, theme, palette, size)
├── hooks/             # useBanner — derives banner URL from context + route
├── pages/             # Home, Dashboard, NotFound
├── types/             # CardsType enum
├── utils/             # constants, localStorage wrapper, svgColors
└── __tests__/         # Mirrors src/ structure; 87 tests across 6 files
```

---

## Backend API

The frontend consumes a Go backend hosted on Railway.

```
GET /banner/{username}?type={stats|contributions|pinned}&format={twitter|linkedin}&theme={dark|light}
```

Returns `image/svg+xml` directly with `Cache-Control: public, max-age=300`.

Color palette substitution happens entirely on the frontend — the SVG text is fetched once, cached, and re-colored in memory on every palette change with no additional network requests.

---

## Testing

```bash
bun run test
```

87 tests across 6 suites:

| Suite | Coverage |
|---|---|
| `api/banner` | URL builder, error class, validateUsername, fetchBannerBlob |
| `utils/localStorage` | get/set/has/remove/clear/getRaw/setRaw + TTL expiry |
| `utils/svgColors` | applyPaletteToContribSvg, applyPaletteToStatsSvg |
| `hooks/useBanner` | URL derivation, card-type mapping |
| `context/DashboardContext` | State management, localStorage persistence |
| `appComponents/UserNameInputModal` | Form interactions, API validation, error display |
