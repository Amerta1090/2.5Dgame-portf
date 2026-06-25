# 25DGAME — Interactive Portfolio Game

An interactive 2.5D side-scrolling exploration game built with Astro, React, TypeScript, Tailwind CSS, and Framer Motion. Visitors explore the mind, work, and identity of Abdul Majid Ridwan through six distinct zones with puzzles, hidden lore, and achievements.

## Tech Stack

- **Framework**: [Astro](https://astro.build) (SSG shell) + [React](https://react.dev) (SPA game engine)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + CSS
- **Language**: TypeScript (strict)
- **Testing**: [Vitest](https://vitest.dev)
- **Quality**: ESLint, Prettier, `tsc --noEmit`

## Quick Start

```sh
npm install
npm run dev        # Start dev server
```

The game is served at `http://localhost:4321`.

## Commands

| Command           | Action                              |
|-------------------|-------------------------------------|
| `npm run dev`     | Start dev server                    |
| `npm run build`   | Build to `dist/`                    |
| `npm run preview` | Preview production build            |
| `npm test`        | Run tests (Vitest)                  |
| `npm run lint`    | Lint source (ESLint)                |
| `npm run typecheck` | TypeScript check                  |

## Project Structure

```
src/
├── game/
│   ├── engine/           # Game loop, camera, movement, collision, interaction
│   ├── state/            # React Context, reducers, save system
│   ├── zones/            # Zone layouts + subroom components
│   ├── art/              # Backgrounds (CSS), player sprite, props (SVG)
│   ├── puzzles/          # Mini-game components (drag/sort/click/debug/decision)
│   ├── ui/               # HUD, dialogue box, pause menu, toasts
│   ├── screens/          # Title screen, main menu, credits, portfolio
│   ├── effects/          # Scanlines, screen wipe, letterbox
│   ├── entities/         # Player, interactable, door, lore fragment
│   ├── data/             # JSON normalization + unified data loader
│   ├── styles/           # Global game CSS
│   ├── types.ts          # All TypeScript interfaces
│   └── constants.ts      # Magic numbers, zone dimensions, speeds
├── pages/
│   ├── index.astro       # Main entry point
│   └── resume.astro      # Static resume page
├── layouts/
│   └── game.astro        # Minimal HTML shell with SEO meta
└── components/
    └── Game.tsx          # Root game component (screen router)
```

## Zones

1. **Spawn Area** — Terminal room with profile data + first lore fragment
2. **Academy Room** — Certificate frames, honors pedestals, timeline sort puzzle
3. **Workshop** — Hub with 3 subrooms (AI Lab, Web Studio, IoT Workshop) + skill puzzles
4. **Project District** — 21 project buildings (6 featured) with interior views
5. **Career Corridor** — Experience timeline stations + decision sim puzzle
6. **Final Hidden Room** — Narrative payoff with monologue + journey stats

## Data Layer

All portfolio data is sourced from `data/*.json` files:
- `profile.json`, `skills.json`, `experience.json`, `projects.json`
- `licenses_certifications.json`, `honors.json`, `volunteering.json`

Data is normalized at build time via `src/game/data/transform.ts` and bundled into the JS bundle — zero runtime API calls.

## Architecture

- **HTML/CSS rendering** (not Canvas) — CSS gradients, geometric divs, inline SVG for all visuals
- **Parallax scrolling** — background (0.2x), midground (0.5x), foreground (1x)
- **Camera system** — Framer Motion `useSpring` follows player, clamped to zone bounds
- **State management** — React Context with reducer pattern, localStorage save/load
- **Zone-based lazy loading** — only current zone components mount
- **Keyboard-first** — full keyboard navigation, no mouse required

## Sprint Roadmap

The project follows the phased approach documented in `BLUEPRINT.md`:
- Phase 0: Foundation Setup (scaffolding, state, CI)
- Phase 1: Core Engine (game loop, movement, collision, interaction)
- Phase 2: Art System (player, props, backgrounds)
- Phase 3-8: Zone Content (6 zones with puzzles, lore, and interactables)
- Phase 9: UI Components (screens, HUD, effects, portfolio fallback)
- Phase 10: Content Integration & Tuning (data mapping, achievements, easter eggs)
- Phase 11: Launch (SEO, deploy, resume page, documentation)

## Deployment

Deployed via [Vercel](https://vercel.com). The `vercel.json` config provides SPA fallback routing. For Cloudflare Pages, the `public/_redirects` file is configured.

## License

MIT — See LICENSE file.
