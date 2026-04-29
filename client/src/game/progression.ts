import type { Hero, Monster } from "@jobfair/shared";

const XP_TO_LEVEL = 100;

export function gainXp(hero: Hero, monster: Monster): Hero {
  const newXp = hero.xp + monster.xp;

  if (newXp >= XP_TO_LEVEL) {
    return {
      ...hero,
      level: hero.level + 1,
      xp: newXp - XP_TO_LEVEL,
      stats: {
        health:  hero.stats.health  + 10,
        attack:  hero.stats.attack  + 4,
        defense: hero.stats.defense + 3,
        magic:   hero.stats.magic   + 5,
      },
    };
  }

  return { ...hero, xp: newXp };
}
