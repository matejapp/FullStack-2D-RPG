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
  moves: Move[];
  xp: number;            // XP awarded to hero for defeating this monster         
  spriteKey?: string;
  backgroundSprite?: string;  
}

export interface Hero {
  level: number;
  xp: number;
  stats: Stats;
  equippedMoves: Move[];  
  learnedMoves: Move[];   
}



export interface RunConfig {
  runId: string;
  hero: Hero;
  encounters: Monster[];  
}


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
  encounterIndex: number;     
  turn: number;
  hero: CombatantState & { stats: Stats; equippedMoves: Move[] };
  monster: CombatantState & { stats: Stats; moves: Move[]; id: string };
  lastHeroMoveId?: string;    
}




export type StartRunResponse = RunConfig;


export interface NextMoveRequest {
  state: BattleState;
}

export interface NextMoveResponse {
  moveId: string;
}
