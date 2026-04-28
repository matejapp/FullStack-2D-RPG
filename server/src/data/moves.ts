import type { Move } from "@jobfair/shared";

// Knight default moveset (from spec).
// Numbers are first-pass; tweak until combat feels fun.
export const knightDefaultMoves: Move[] = [
  {
    id: "knight.slash",
    name: "Slash",
    type: "physical",
    effect: { kind: "damage", baseValue: 14 },
    description: "Moderate physical damage. Reduced by Defense.",
  },
  {
    id: "knight.shield_up",
    name: "Shield Up",
    type: "physical",
    effect: { kind: "buff", stat: "defense", amount: 6, durationTurns: 2 },
    description: "Raises your Defense for 2 turns.",
  },
  {
    id: "knight.battle_cry",
    name: "Battle Cry",
    type: "physical",
    effect: { kind: "buff", stat: "attack", amount: 6, durationTurns: 2 },
    description: "Raises your Attack for 2 turns.",
  },
  {
    id: "knight.second_wind",
    name: "Second Wind",
    type: "magic",
    effect: { kind: "heal", baseValue: 18 },
    description: "Heals you for a moderate amount. Scales off Magic.",
  },
];
