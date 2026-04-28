import { useGameStore } from "../store/gameStore.js";
import { fetchRunConfig } from "../api/client.js";

export function MainMenu() {
  const startRun = useGameStore((s) => s.startRun);

  async function onStart() {
    const config = await fetchRunConfig();
    startRun(config);
  }

  return (
    <div className="screen menu">
      <h1>Gauntlet</h1>
      <button onClick={onStart}>Start a new run</button>
      <button onClick={() => window.close()}>Exit</button>
    </div>
  );
}
