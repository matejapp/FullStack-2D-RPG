import type { Monster, Move } from "@jobfair/shared";



const goblinWarriorMoves: Move[] = [
  { id: "goblin_warrior.rusty_blade", name: "Rusty Blade", type: "physical", effect: { kind: "damage", baseValue: 10 } },
  { id: "goblin_warrior.dirty_kick", name: "Dirty Kick", type: "physical", effect: { kind: "damage_and_debuff", baseValue: 6, stat: "defense", amount: 4, durationTurns: 2 } },
  { id: "goblin_warrior.frenzy", name: "Frenzy", type: "physical", effect: { kind: "buff", stat: "attack", amount: 5, durationTurns: 2 } },
  { id: "goblin_warrior.headbutt", name: "Headbutt", type: "physical", effect: { kind: "damage", baseValue: 16 } },
];

const giantSpiderMoves: Move[] = [
  { id: "spider.bite", name: "Bite", type: "physical", effect: { kind: "damage", baseValue: 12 } },
  { id: "spider.web_throw", name: "Web Throw", type: "physical", effect: { kind: "damage_and_debuff", baseValue: 6, stat: "defense", amount: 4, durationTurns: 2 } },
  { id: "spider.pounce", name: "Pounce", type: "physical", effect: { kind: "damage", baseValue: 18 } },
  { id: "spider.skitter", name: "Skitter", type: "physical", effect: { kind: "buff", stat: "defense", amount: 5, durationTurns: 2 } },
];

const goblinMageMoves: Move[] = [
  { id: "goblin_mage.firebolt", name: "Firebolt", type: "magic", effect: { kind: "damage", baseValue: 14 } },
  { id: "goblin_mage.arcane_surge", name: "Arcane Surge", type: "magic", effect: { kind: "buff", stat: "magic", amount: 6, durationTurns: 2 } },
  { id: "goblin_mage.mana_drain", name: "Mana Drain", type: "magic", effect: { kind: "damage_and_debuff", baseValue: 6, stat: "magic", amount: 4, durationTurns: 2 } },
  { id: "goblin_mage.hex_shield", name: "Hex Shield", type: "magic", effect: { kind: "buff", stat: "defense", amount: 5, durationTurns: 2 } },
];

const witchMoves: Move[] = [
  { id: "witch.shadow_bolt", name: "Shadow Bolt", type: "magic", effect: { kind: "damage", baseValue: 18 } },
  { id: "witch.drain_life", name: "Drain Life", type: "magic", effect: { kind: "damage_and_heal", baseValue: 8 } },
  { id: "witch.curse", name: "Curse", type: "magic", effect: { kind: "debuff", stat: "attack", amount: 5, durationTurns: 2 } },
  { id: "witch.dark_pact", name: "Dark Pact", type: "magic", effect: { kind: "self_buff_with_cost", stat: "magic", amount: 8, durationTurns: 2, hpCost: 8 } },
];

const dragonMoves: Move[] = [
  { id: "dragon.flame_breath", name: "Flame Breath", type: "magic", effect: { kind: "damage", baseValue: 22 } },
  { id: "dragon.claw_swipe", name: "Claw Swipe", type: "physical", effect: { kind: "damage", baseValue: 16 } },
  { id: "dragon.intimidate", name: "Intimidate", type: "physical", effect: { kind: "debuff", stat: "attack", amount: 6, durationTurns: 2 } },
  { id: "dragon.dragon_scales", name: "Dragon Scales", type: "physical", effect: { kind: "buff", stat: "defense", amount: 8, durationTurns: 2 } },
];


export const monsters: Monster[] = [
  {
    id: "goblin_warrior",
    name: "Goblin Warrior",
    level: 1,
    stats: { health: 70, attack: 10, defense: 5, magic: 4 },
    moves: goblinWarriorMoves,
    xp: 50,
    spriteKey: "/assets/GoblinWarrior.PNG",
  },
  {
    id: "giant_spider",
    name: "Giant Spider",
    level: 2,
    stats: { health: 90, attack: 12, defense: 7, magic: 4 },
    moves: giantSpiderMoves,
    xp: 75,
    spriteKey: "/assets/Spider.PNG",
  },
  {
    id: "goblin_mage",
    name: "Goblin Mage",
    level: 3,
    stats: { health: 95, attack: 8, defense: 6, magic: 14 },
    moves: goblinMageMoves,
    xp: 100,
    spriteKey: "/assets/GoblinMage.PNG",
  },
  {
    id: "witch",
    name: "Witch",
    level: 4,
    stats: { health: 110, attack: 8, defense: 7, magic: 18 },
    moves: witchMoves,
    xp: 150,
    spriteKey: "/assets/Witch.PNG",
  },
  {
    id: "dragon",
    name: "Dragon",
    level: 5,
    stats: { health: 160, attack: 16, defense: 12, magic: 16 },
    moves: dragonMoves,
    xp: 200,
    spriteKey: "/assets/Dragon.PNG",
  },
];
