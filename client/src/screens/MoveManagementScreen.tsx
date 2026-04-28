import { useGameStore } from "../store/gameStore.js";

// TODO: lists hero.learnedMoves, lets player swap them in/out of equippedMoves.
export function MoveManagementScreen() {
  const { hero, setScreen } = useGameStore();

  return (
    <div className="screen moves">
      <h2>Moves</h2>
      <h3>Equipped</h3>
      <ul>
        {hero?.equippedMoves.map((m) => (
          <li onClick={() => removeMove(m.id)} key={m.id}>{m.name}</li>
          
        ))}
      </ul>
      <h3>Learned</h3>
      <ul>
        {hero?.learnedMoves.map((m) => (
          <li key={m.id}>{m.name}</li>
        ))}
      </ul>
      <button onClick={() => setScreen("map")}>Back</button>
    </div>
  );
}
