import type { Move, Stats, ActiveModifier } from "@jobfair/shared";

// Client-side combat math, kept in sync with server expectations via shared types.
// Damage formulas are intentionally simple — tweak until it feels good.

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
    const raw = move.baseValue + attackerStats.attack * 0.5;
    return Math.max(1, Math.round(raw - defenderStats.defense * 0.4));
  }
  // magic ignores defense
  return Math.max(1, Math.round(move.baseValue + attackerStats.magic * 0.5));
}

export function tickModifiers(mods: ActiveModifier[]): ActiveModifier[] {
  return mods
    .map((m) => ({ ...m, remainingTurns: m.remainingTurns - 1 }))
    .filter((m) => m.remainingTurns > 0);
}
