import { useGameStore } from "../store/gameStore.js";

export function MapScreen() {
  const { hero, encounters, encounterIndex, enterBattle, setScreen } = useGameStore();

  return (
    <div className="screen map">
      <h2>Run Overview</h2>
      {hero && (
        <p style={{ color: "#9999cc", fontSize: "0.85rem", margin: 0 }}>
          Level {hero.level} &nbsp;·&nbsp; {hero.xp} / 100 XP
        </p>
      )}
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
      <button onClick={() => setScreen("menu")}>Menu</button>
    </div>
  );
}
