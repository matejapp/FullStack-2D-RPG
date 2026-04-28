import type { BattleState } from "@jobfair/shared";

// Default bot: pick a random move from the monster's moveset.
// Bonus #8 in the GD's backlog: make this situational
// (e.g. heal-style move when low HP, buff when not buffed).
export function pickMonsterMove(state: BattleState): string {
  const moves = state.monster.moves;
  if (moves.length === 0) {
    throw new Error("monster has no moves");
  }
  const idx = Math.floor(Math.random() * moves.length);
  return moves[idx]!.id;
}
