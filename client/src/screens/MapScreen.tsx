import { useGameStore } from "../store/gameStore.js";

export function MapScreen() {
  const { encounters, encounterIndex, enterBattle, setScreen } = useGameStore();

  return (
    <div className="screen map">
      <h2>Run Overview</h2>
      <ol>
        {encounters.map((m, i) => {
          const beaten = i < encounterIndex;
          const next = i === encounterIndex;
          return (
            <li key={m.id}>
              <button
                disabled={!next}
                onClick={() => enterBattle(i)}
              >
                {i + 1}. {m.name} {beaten ? "✓" : next ? "(next)" : ""}
              </button>
            </li>
          );
        })}
      </ol>
      <button onClick={() => setScreen("moves")}>Manage moves</button>
    </div>
  );
}
