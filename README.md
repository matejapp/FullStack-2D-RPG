# Gauntlet

A turn-based RPG where a hero fights through 5 increasingly difficult monsters. Defeating a monster grants XP and a chance to learn one of its moves.

**Stack:** React + Vite + TypeScript (client) · Node + Express + TypeScript (server) · npm workspaces monorepo with shared types.

## Gameplay

- Start a run to receive a randomly seeded 5-encounter gauntlet
- Each battle is turn-based — pick one of your equipped moves, watch the monster respond
- Win: gain XP (level up at 100 XP, boosting all stats) and learn one of the monster's moves
- Lose: run ends, save is wiped
- Manage up to 4 equipped moves from your full learned pool between battles
- Runs are saved to localStorage — close and reopen to continue where you left off

## Project structure

```
JobFair2026/
├── package.json              # root: npm workspaces, runs everything
├── tsconfig.base.json        # shared TS compiler options
│
├── shared/                   # types used by both client and server
│   └── src/index.ts          # Move, Monster, Stats, Hero, BattleState, API contracts
│
├── server/                   # Express API
│   └── src/
│       ├── index.ts          # Express on :3001
│       ├── routes/
│       │   ├── run.ts        # GET  /api/run/start        -> RunConfig
│       │   └── battle.ts     # POST /api/battle/next-move -> { moveId }
│       ├── game/
│       │   ├── runBuilder.ts # builds the 5-encounter run + hero
│       │   └── monsterAi.ts  # picks the monster's next move
│       └── data/
│           ├── moves.ts      # knight default moveset
│           └── monsters.ts   # 5 monsters with sprites, moves, and XP values
│
└── client/                   # React app (Vite)
    ├── index.html
    ├── vite.config.ts        # proxies /api -> :3001 in dev
    └── src/
        ├── App.tsx           # screen router
        ├── api/client.ts     # fetch wrappers for both endpoints
        ├── store/gameStore.ts# Zustand store: screen, run, hero, battle state
        ├── screens/
        │   ├── MainMenu.tsx          # start / continue run
        │   ├── MapScreen.tsx         # encounter list + XP progress
        │   ├── BattleScreen.tsx      # turn loop, HP bars, sprites, move list
        │   └── MoveManagementScreen.tsx  # equip / unequip moves
        └── game/
            ├── combat.ts      # client-side damage math and battle engine
            ├── progression.ts # XP gain and level-up logic
            ├── moveManagment.ts # equip/unequip with max-4 cap
            ├── sprites.ts     # monster sprite resolution
            └── persistence.ts # localStorage save/load/clear
```

## Architecture notes

- **Monorepo with `shared/`** — both sides import the same `Move`, `Monster`, `BattleState` types; a renamed field breaks the build on both sides.
- **Server owns config** — monster stats, moves, and AI live in `server/src/data/` so they can be tuned without a client rebuild.
- **Client runs the loop, server answers questions** — the client manages the full turn loop and renders everything. The server only handles run generation and monster AI.
- **Screen state in the store** — four screens (menu, map, battle, moves) are routed via a Zustand `screen` field; no router library needed.

## Setup

Requires Node.js 20+ and npm 10+.

```bash
# Install all workspaces
npm install

# Run client + server together
npm run dev
```

- Server: **http://localhost:3001**
- Client: **http://localhost:5173** (proxies `/api/*` to the server)

```bash
# Run individually
npm run dev:server
npm run dev:client

# Typecheck everything
npm run typecheck
```
