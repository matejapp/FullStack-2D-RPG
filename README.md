# Gauntlet — Nordeus Job Fair 2026

Full Stack Challenge submission. Turn-based RPG: a hero fights through 5 monsters; learns one of the defeated monster's moves at random.

**Stack:** React + Vite + TypeScript (client) · Node + Express + TypeScript (server) · npm workspaces monorepo with shared types.

## Project structure

```
JobFair2026/
├── package.json              # root: npm workspaces, runs everything
├── tsconfig.base.json        # shared TS compiler options
├── .gitignore / .nvmrc
│
├── shared/                   # types used by BOTH client and server
│   └── src/index.ts          # Move, Monster, Stats, BattleState, API contracts
│
├── server/                   # Express API
│   └── src/
│       ├── index.ts          # boots Express on :3001
│       ├── routes/
│       │   ├── run.ts        # GET  /api/run/start         -> RunConfig
│       │   └── battle.ts     # POST /api/battle/next-move  -> { moveId }
│       ├── game/
│       │   ├── runBuilder.ts # builds the 5-encounter run + hero
│       │   └── monsterAi.ts  # picks the monster's next move
│       └── data/
│           ├── moves.ts      # knight default moveset
│           └── monsters.ts   # 5 monsters, ordered easy -> hard
│
└── client/                   # React app (Vite)
    ├── index.html
    ├── vite.config.ts        # proxies /api -> :3001 in dev
    └── src/
        ├── main.tsx
        ├── App.tsx           # screen router
        ├── api/client.ts     # fetch wrappers around the two endpoints
        ├── store/gameStore.ts# zustand store: screen, run, hero, battle
        ├── screens/
        │   ├── MainMenu.tsx
        │   ├── MapScreen.tsx
        │   ├── BattleScreen.tsx
        │   └── MoveManagementScreen.tsx
        ├── game/combat.ts    # client-side damage/modifier math
        └── styles/global.css
```

### Why this layout

- **Monorepo with `shared/`** — both sides import the *same* `Move`, `Monster`, `BattleState` types. If you rename a field, the typechecker yells on both sides at once.
- **Server owns combat config** — the GD wants to tweak monster stats and bot behavior without a client rebuild. All numbers live in `server/src/data/`.
- **Client owns the loop, server answers questions** — the client runs the turn loop and renders. The server only answers "give me the run config" and "what does the monster do this turn".
- **`screen` state in the store, not a router** — the spec is 4 screens (menu, map, battle, moves). A switch beats pulling in `react-router`.

## What you need to install

| Tool | Version | Why |
| --- | --- | --- |
| **Node.js** | 20.x LTS or newer | Runs both server and the Vite dev server. `.nvmrc` is set to `20`. |
| **npm** | 10+ (ships with Node 20) | Workspaces are managed with npm, no extra package manager needed. |
| **Git** | any recent | Source control + final submission. |
| **VS Code** (recommended) | — | With these extensions: ESLint, Prettier, ES7+ React snippets. |

If Node isn't installed, get it from https://nodejs.org (LTS) or use `nvm` / `nvm-windows`.

## Setup

From the project root (`JobFair2026/`):

```bash
# 1. install all workspaces in one go
npm install

# 2. run client + server together (two parallel processes, one terminal)
npm run dev
```

That gives you:
- Server on **http://localhost:3001** (`/health`, `/api/run/start`, `/api/battle/next-move`)
- Client on **http://localhost:5173** — dev server proxies `/api/*` to the server

### Run only one side

```bash
npm run dev:server     # just Express, with auto-reload via tsx
npm run dev:client     # just Vite
```

### Quick sanity check before coding

```bash
# server is up
curl http://localhost:3001/health
# the run config endpoint works
curl http://localhost:3001/api/run/start
```

### Typecheck everything

```bash
npm run typecheck
```

## A note on the spec's "GET" for next-move

The challenge brief says both endpoints are GET. The run-config one is fine as GET. For next-move we send the full `BattleState`, so the scaffold uses **POST with a JSON body** — cleaner than encoding a battle into query params. If the grader wants strict GET, swap the route to `runRouter.get` and read state from `req.query`. It's a 5-line change.

## What's stubbed vs. done

**Done in the scaffold**
- Workspaces, TS configs, dev scripts.
- Both API endpoints wired end-to-end with shared types.
- All 5 monsters and their movesets defined per spec.
- Knight default moveset.
- Random-pick monster AI.
- All 4 screens render and route via the store.

**Stubbed — your build-out**
- `BattleScreen`: the actual turn loop, HP bars, sprites, applying moves.
- `MoveManagementScreen`: drag/swap between equipped & learned.
- Post-battle: drop a random move from the defeated monster, append to `hero.learnedMoves`.
- XP / level-up: increase hero stats on level up.
- Combat formulas in `client/src/game/combat.ts` need numbers tweaked to feel fun.

## Submission reminder

Email `jobfair@nordeus.com` with subject **FullStack Challenge**. Include full name + LinkedIn. A short screen-recording of gameplay helps a lot. **Deadline: May 3rd, 2026, end of day.**
