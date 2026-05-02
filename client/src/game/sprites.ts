const SPRITE_MAP: Record<string, string> = {
  goblin_warrior: "/assets/Entity/GoblinWarrior.PNG",
  giant_spider:   "/assets/Entity/Spider.PNG",
  goblin_mage:    "/assets/Entity/GoblinMage.PNG",
  witch:          "/assets/Entity/Witch.PNG",
  dragon:         "/assets/Entity/Dragon.PNG",
  hero:           "/assets/Entity/Warrior.PNG",
};

const BACKGROUND_MAP: Record<string, string> = {
  goblin_warrior: "/assets/Backgrounds/GoblinWarriorBackground.jpg",
  giant_spider:   "/assets/Backgrounds/GiantSpiderBackground.jpg",
  goblin_mage:    "/assets/Backgrounds/GoblinMageBackground.jpg",
  witch:          "/assets/Backgrounds/WitchBackground.jpg",
  dragon:         "/assets/Backgrounds/DragonBackground.jpg",
}

export function getSpriteUrl(key: string): string {
  if (key.startsWith("/")) return key;
  return SPRITE_MAP[key] ?? "/assets/Entity/Warrior.PNG";
}

export function getBackgroundUrl(key: string): string {
  if (key.startsWith("/")) return key;
  return BACKGROUND_MAP[key] ?? "background: #1a1a23";
}
