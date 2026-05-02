import type { BattleState, Move } from "@jobfair/shared";



function scoreMove(move:Move, state: BattleState): number{
  let score = 0;
  const hpRatio = state.monster.currentHp / state.monster.stats.health;

  if(hpRatio < 0.3){
    if(move.effect.kind === "heal" || move.effect.kind === "damage_and_heal"){
      score += 50;
    }
  }

  const heroHpRatio = state.hero.currentHp / state.hero.stats.health;
  if(heroHpRatio < 0.3){
    if(move.effect.kind === "damage" || move.effect.kind === "damage_and_heal"){
      score += 40;
    }
  }

  if (move.effect.kind === "buff" || move.effect.kind === "self_buff_with_cost") {
    const { stat } = move.effect;
    const alreadyBuffed = state.monster.modifiers.some(
      (mod) => mod.stat === stat && mod.amount > 0
    );
    if (alreadyBuffed) {
      score -= 60;
    }
  }

  if(move.type === "magic" && state.hero.stats.defense > state.hero.stats.magic){
    score += 20;
  }
  if(move.type === "physical" && state.hero.stats.magic > state.hero.stats.defense){
    score += 20;
  }
  return score;
}

  


export function pickMonsterMove(state: BattleState): string{
  const moves = state.monster.moves;
  if(moves.length === 0) throw new Error ("Monster has no moves!");

  let bestId = moves[0]!.id;
  let bestScore = -Infinity;

  for(const move of moves){
    const s = scoreMove(move, state) + (Math.random() * 20 - 10); // Add some randomness to prevent predictability
    if(s > bestScore){
      bestScore = s;
      bestId = move.id;
    }
  }
  return bestId;
}