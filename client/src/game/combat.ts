import type { Move, Stats, ActiveModifier, Monster } from "@jobfair/shared";



export function effectiveStat(
  base: number,
  modifiers: ActiveModifier[],
  key: keyof Stats
): number {
  return modifiers
    .filter((m) => m.stat === key)
    .reduce((acc, m) => acc + m.amount, base);
}

export function computeDamage(
  move: Extract<Move["effect"], { kind: "damage" }> | { kind: "damage"; baseValue: number },
  attackerStats: Stats,
  defenderStats: Stats,
  type: "physical" | "magic"
): number {
  if (type === "physical") {
    const raw = move.baseValue + attackerStats.attack * 1;
    return Math.max(1, Math.round(raw - defenderStats.defense * 0.6));
  }
  
  return Math.max(1, Math.round(move.baseValue + attackerStats.magic * 1));
}

export function tickModifiers(mods: ActiveModifier[]): ActiveModifier[] {
  return mods
    .map((m) => ({ ...m, remainingTurns: m.remainingTurns - 1 }))
    .filter((m) => m.remainingTurns > 0);
}

export function getEntityStats(monster : Monster) : string{
  return `HP: ${monster.stats.health}  Atk: ${monster.stats.attack}  Def: ${monster.stats.defense}  Mag: ${monster.stats.magic}`;
}


export function getEntityMoveList(monster : Monster) : string{
  return monster.moves.map((m) => m.name + "  (" + m.effect.kind + ")").join(", ");
}

export function comoputeWarriorDamage(move: Move, attackerStats: Stats,){
  switch(move.effect.kind){
    case "damage": return move.effect.baseValue + (move.type === "physical" ? attackerStats.attack : attackerStats.magic) * 1;
    case "damage_and_heal": 
    case "damage_and_debuff": return move.effect.baseValue + (move.type === "physical" ? attackerStats.attack : attackerStats.magic) * 1;
    default: return 0;
    
  }   
  
}

