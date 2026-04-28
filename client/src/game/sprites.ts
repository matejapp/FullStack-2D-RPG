const SPRITE_MAP: Record<string, string> = {
  goblin_warrior: "/assets/GoblinWarrior.PNG",
  giant_spider:   "/assets/Spider.PNG",
  goblin_mage:    "/assets/GoblinMage.PNG",
  witch:          "/assets/Witch.PNG",
  dragon:         "/assets/Dragon.PNG",
  hero:           "/assets/Warrior.PNG",
};

export function getSpriteUrl(key: string): string {
  if (key.startsWith("/")) return key;
  return SPRITE_MAP[key] ?? "/assets/Warrior.PNG";
}
