import { useState } from "react";
import { useGameStore } from "../store/gameStore.js";
import { fetchRunConfig } from "../api/client.js";
import { loadSavedRun } from "../../../server/src/data/persistence.js";

export function MainMenu() {
  const { startRun, resumeRun } = useGameStore();
  const savedRun = loadSavedRun();
  const [loading, setLoading] = useState(false);

  async function onStart() {
    setLoading(true);
    const config = await fetchRunConfig();
    startRun(config);
  }

  return (
    <div className="screen menu">
      <h1>Gauntlet</h1>
      {savedRun && (
        <button onClick={() => resumeRun(savedRun)}>
          Continue (encounter {savedRun.encounterIndex + 1}/5 · Lv {savedRun.hero.level})
        </button>
      )}
      <button onClick={onStart} disabled={loading}>
        {loading ? "Loading..." : "Start new run"}
      </button>
      <button onClick={() => window.close()}>Exit</button>
    </div>
  );
}
