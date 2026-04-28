// Shared types between client and server.


export type StatKey = "health" | "attack" | "defense" | "magic";

export interface Stats {
  health: number;
  attack: number;
  defense: number;
  magic: number;
}

export type MoveType = "physical" | "magic";

export type MoveEffect =
  | { kind: "damage"; baseValue: number }
  | { kind: "heal"; baseValue: number }
  | { kind: "damage_and_heal"; baseValue: number } 
  | { kind: "buff"; stat: StatKey; amount: number; durationTurns: number }
  | { kind: "debuff"; stat: StatKey; amount: number; durationTurns: number }
  | {
      kind: "damage_and_debuff";
      baseValue: number;
      stat: StatKey;
      amount: number;
      durationTurns: number;
    }
  | {
      kind: "self_buff_with_cost";
      stat: StatKey;
      amount: number;
      durationTurns: number;
      hpCost: number;
    };

export interface Move {
  id: string;
  name: string;
  type: MoveType;
  effect: MoveEffect;
  description?: string;
}

export interface Monster {
  id: string;
  name: string;
  level: number;          // used as difficulty hint, not for stat scaling
  stats: Stats;
  moves: Move[];          // full moveset; learned-move drop is picked from this
  spriteKey?: string;     // client-side asset lookup
}

export interface Hero {
  level: number;
  xp: number;
  stats: Stats;
  equippedMoves: Move[];  // active loadout (e.g. 4 slots)
  learnedMoves: Move[];   // every move ever learned, including defaults
}

// ----- Run / battle wire types -----

export interface RunConfig {
  runId: string;
  hero: Hero;
  encounters: Monster[];  // 5 monsters in order
}

// Active modifier on the battle (e.g. Defense up for 2 turns)
export interface ActiveModifier {
  stat: StatKey;
  amount: number;
  remainingTurns: number;
}

export interface CombatantState {
  currentHp: number;
  modifiers: ActiveModifier[];
}

export interface BattleState {
  runId: string;
  encounterIndex: number;     // which of the 5 encounters (0-4)
  turn: number;
  hero: CombatantState & { stats: Stats; equippedMoves: Move[] };
  monster: CombatantState & { stats: Stats; moves: Move[]; id: string };
  lastHeroMoveId?: string;    // the move the hero just played this turn
}

// ----- API contracts -----

// GET /api/run/start  -> RunConfig
export type StartRunResponse = RunConfig;

// POST /api/battle/next-move  body: NextMoveRequest -> NextMoveResponse
// (using POST because we send battle state; spec says "GET", we can switch
//  if you want to keep it strictly GET — see README)
export interface NextMoveRequest {
  state: BattleState;
}

export interface NextMoveResponse {
  moveId: string;
}
