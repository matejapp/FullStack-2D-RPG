import type { Hero,Move } from "@jobfair/shared";

export const MAX_EQUIPPED_MOVES = 4;

export function removeEquippedMove(hero: Hero, moveId: string): Hero {
  return { ...hero, equippedMoves: hero.equippedMoves.filter((m) => m.id !== moveId) };
}

export function equipMove(hero: Hero, moveId: string): Hero {
  if (hero.equippedMoves.length >= MAX_EQUIPPED_MOVES) return hero;
  if (hero.equippedMoves.some((m) => m.id === moveId)) return hero;
  const move = hero.learnedMoves.find((m) => m.id === moveId);
  if (!move) return hero;
  return { ...hero, equippedMoves: [...hero.equippedMoves, move] };
}

export function getMoveDescription(move: Move): string {
    return `${move.effect.kind} - ${move.type}`;
}
