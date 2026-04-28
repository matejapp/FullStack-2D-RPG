import type { BattleState, ActiveModifier, Stats } from "@jobfair/shared";
import { computeDamage, effectiveStat, tickModifiers } from "./combat.js";

function effStats(base: Stats, mods: ActiveModifier[]): Stats {
  return {
    health:  effectiveStat(base.health,  mods, "health"),
    attack:  effectiveStat(base.attack,  mods, "attack"),
    defense: effectiveStat(base.defense, mods, "defense"),
    magic:   effectiveStat(base.magic,   mods, "magic"),
  };
}

export interface ApplyResult {
  nextState: BattleState;
  log: string;
}

function doApply(
  state: BattleState,
  attackerSide: "hero" | "monster",
  moveId: string
): ApplyResult {
  const defenderSide = attackerSide === "hero" ? "monster" : "hero";

  const moves =
    attackerSide === "hero" ? state.hero.equippedMoves : state.monster.moves;
  const move = moves.find((m) => m.id === moveId);
  if (!move) {
    return { nextState: state, log: "Unknown move: " + moveId };
  }

  let atkHp   = state[attackerSide].currentHp;
  let atkMods = [...state[attackerSide].modifiers];
  let defHp   = state[defenderSide].currentHp;
  let defMods = [...state[defenderSide].modifiers];

  const atkEff = effStats(state[attackerSide].stats, atkMods);
  const defEff = effStats(state[defenderSide].stats, defMods);

  const atkLabel = attackerSide === "hero" ? "You" : "Enemy";
  const defLabel = defenderSide === "hero" ? "you" : "the enemy";

  let log = "";
  const e = move.effect;

  switch (e.kind) {
    case "damage": {
      const dmg = computeDamage(e, atkEff, defEff, move.type);
      defHp = Math.max(0, defHp - dmg);
      log = atkLabel + " used " + move.name + " - " + dmg + " damage to " + defLabel + ".";
      break;
    }
    case "heal": {
      const amount = Math.max(1, Math.round(e.baseValue + atkEff.magic * 0.3));
      atkHp = Math.min(state[attackerSide].stats.health, atkHp + amount);
      log = atkLabel + " used " + move.name + " - healed " + amount + " HP.";
      break;
    }
    case "damage_and_heal": {
      const dmg = computeDamage(
        { kind: "damage", baseValue: e.baseValue },
        atkEff, defEff, move.type
      );
      defHp = Math.max(0, defHp - dmg);
      const healed = Math.max(1, Math.round(dmg * 0.5));
      atkHp = Math.min(state[attackerSide].stats.health, atkHp + healed);
      log = atkLabel + " used " + move.name + " - " + dmg + " damage, drained " + healed + " HP.";
      break;
    }
    case "buff": {
      atkMods = [...atkMods, { stat: e.stat, amount: e.amount, remainingTurns: e.durationTurns }];
      log = atkLabel + " used " + move.name + " - " + e.stat + " +" + e.amount + " for " + e.durationTurns + " turns.";
      break;
    }
    case "debuff": {
      defMods = [...defMods, { stat: e.stat, amount: -e.amount, remainingTurns: e.durationTurns }];
      log = atkLabel + " used " + move.name + " - " + defLabel + "'s " + e.stat + " -" + e.amount + ".";
      break;
    }
    case "damage_and_debuff": {
      const dmg = computeDamage(
        { kind: "damage", baseValue: e.baseValue },
        atkEff, defEff, move.type
      );
      defHp = Math.max(0, defHp - dmg);
      defMods = [...defMods, { stat: e.stat, amount: -e.amount, remainingTurns: e.durationTurns }];
      log = atkLabel + " used " + move.name + " - " + dmg + " damage + " + defLabel + "'s " + e.stat + " -" + e.amount + ".";
      break;
    }
    case "self_buff_with_cost": {
      atkHp = Math.max(0, atkHp - e.hpCost);
      atkMods = [...atkMods, { stat: e.stat, amount: e.amount, remainingTurns: e.durationTurns }];
      log = atkLabel + " used " + move.name + " - " + e.stat + " +" + e.amount + ", cost " + e.hpCost + " HP.";
      break;
    }
    default:
      log = atkLabel + " used " + move.name + ".";
  }

  const nextHero =
    attackerSide === "hero"
      ? { ...state.hero,    currentHp: atkHp, modifiers: atkMods }
      : { ...state.hero,    currentHp: defHp, modifiers: defMods };

  const nextMonster =
    attackerSide === "monster"
      ? { ...state.monster, currentHp: atkHp, modifiers: atkMods }
      : { ...state.monster, currentHp: defHp, modifiers: defMods };

  return {
    nextState: {
      ...state,
      hero: nextHero,
      monster: nextMonster,
      lastHeroMoveId: attackerSide === "hero" ? move.id : state.lastHeroMoveId,
    },
    log,
  };
}

export function applyHeroMove(state: BattleState, moveId: string): ApplyResult {
  return doApply(state, "hero", moveId);
}

export function applyMonsterMove(state: BattleState, moveId: string): ApplyResult {
  return doApply(state, "monster", moveId);
}

export function endOfTurn(state: BattleState): BattleState {
  return {
    ...state,
    turn: state.turn + 1,
    hero:    { ...state.hero,    modifiers: tickModifiers(state.hero.modifiers) },
    monster: { ...state.monster, modifiers: tickModifiers(state.monster.modifiers) },
  };
}
