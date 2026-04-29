import type { RunConfig, Hero } from "@jobfair/shared";
import { knightDefaultMoves } from "../data/moves.js";
import { monsters } from "../data/monsters.js";


export function buildRunConfig(): RunConfig {
  const hero: Hero = {
    level: 1,
    xp: 0,
    stats: { health: 100, attack: 12, defense: 8, magic: 10 },
    equippedMoves: knightDefaultMoves,
    learnedMoves: knightDefaultMoves,
  };

  return {
    runId: crypto.randomUUID(),
    hero,
    encounters: monsters, 
  };
}

