import { create } from "zustand";
import type { Hero, Monster, BattleState } from "@jobfair/shared";

export type Screen = "menu" | "map" | "battle" | "moves";

interface GameStore {
  screen: Screen;
  setScreen: (s: Screen) => void;

  runId: string | null;
  hero: Hero | null;
  encounters: Monster[];
  encounterIndex: number;
  battle: BattleState | null;

  startRun: (data: { runId: string; hero: Hero; encounters: Monster[] }) => void;
  enterBattle: (encounterIndex: number) => void;
  setBattle: (battle: BattleState | null) => void;
  finishBattle: (won: boolean, learnedMoveId?: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  screen: "menu",
  setScreen: (screen) => set({ screen }),

  runId: null,
  hero: null,
  encounters: [],
  encounterIndex: 0,
  battle: null,

  startRun: ({ runId, hero, encounters }) =>
    set({ runId, hero, encounters, encounterIndex: 0, screen: "map" }),

  enterBattle: (encounterIndex) => set({ encounterIndex, screen: "battle" }),

  setBattle: (battle) => set({ battle }),

  finishBattle: (won, learnedMoveId) =>
    set((s) => {
      if (!won) {
        return { battle: null, screen: "menu", runId: null, hero: null, encounters: [], encounterIndex: 0 };
      }

      let hero = s.hero;
      if (learnedMoveId && hero) {
        const alreadyKnows = hero.learnedMoves.some((m) => m.id === learnedMoveId);
        if (!alreadyKnows) {
          const sourceMove = s.encounters[s.encounterIndex]?.moves.find(
            (m) => m.id === learnedMoveId
          );
          if (sourceMove) {
            hero = { ...hero, learnedMoves: [...hero.learnedMoves, sourceMove] };
          }
        }
      }

      const nextIndex = s.encounterIndex + 1;

      if (nextIndex >= s.encounters.length) {
        return { battle: null, screen: "menu", runId: null, hero: null, encounters: [], encounterIndex: 0 };
      }

      return { battle: null, screen: "map", hero, encounterIndex: nextIndex };
    }),
}));
