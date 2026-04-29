import { create } from "zustand";
import type { Hero, Monster, BattleState } from "@jobfair/shared";
import { removeEquippedMove, equipMove } from "../game/moveManagment.js";
import { gainXp } from "../game/progression.js";
import { saveRun, clearSavedRun, type SavedRun } from "../../../server/src/data/persistence.js";

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
  resumeRun: (save: SavedRun) => void;
  enterBattle: (encounterIndex: number) => void;
  setBattle: (battle: BattleState | null) => void;
  finishBattle: (won: boolean, learnedMoveId?: string) => void;
  removeEquippedMove: (moveId: string) => void;
  equipMove: (moveId: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  screen: "menu",
  setScreen: (screen) => set({ screen }),

  runId: null,
  hero: null,
  encounters: [],
  encounterIndex: 0,
  battle: null,

  startRun: ({ runId, hero, encounters }) => {
    saveRun({ runId, hero, encounters, encounterIndex: 0 });
    set({ runId, hero, encounters, encounterIndex: 0, screen: "map" });
  },

  resumeRun: (save) =>
    set({ runId: save.runId, hero: save.hero, encounters: save.encounters, encounterIndex: save.encounterIndex, screen: "map" }),

  enterBattle: (encounterIndex) => set({ encounterIndex, screen: "battle" }),

  setBattle: (battle) => set({ battle }),

  removeEquippedMove: (moveId) =>
    set((s) => s.hero ? { hero: removeEquippedMove(s.hero, moveId) } : {}),

  equipMove: (moveId) =>
    set((s) => s.hero ? { hero: equipMove(s.hero, moveId) } : {}),

  finishBattle: (won, learnedMoveId) =>
    set((s) => {
      if (!won) {
        clearSavedRun();
        return { battle: null, screen: "menu", runId: null, hero: null, encounters: [], encounterIndex: 0 };
      }

      let hero = s.hero;

      if (hero) {
        const encounter = s.encounters[s.encounterIndex];
        if (encounter) hero = gainXp(hero, encounter);
      }

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
        clearSavedRun();
        return { battle: null, screen: "menu", runId: null, hero: null, encounters: [], encounterIndex: 0 };
      }

      saveRun({ runId: s.runId!, hero: hero!, encounters: s.encounters, encounterIndex: nextIndex });
      return { battle: null, screen: "map", hero, encounterIndex: nextIndex };
    }),
}));
