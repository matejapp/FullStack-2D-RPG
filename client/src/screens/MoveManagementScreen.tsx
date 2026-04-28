import { useGameStore } from "../store/gameStore.js";
import { MAX_EQUIPPED_MOVES, getMoveDescription } from "../game/moveManagment.js";

export function MoveManagementScreen() {
  const { hero, setScreen, removeEquippedMove, equipMove } = useGameStore();

  const equippedIds = new Set(hero?.equippedMoves.map((m) => m.id));
  const full = (hero?.equippedMoves.length ?? 0) >= MAX_EQUIPPED_MOVES;

  return (
    <div className="screen moves">
      <h2>Moves</h2>
      <h3>Equipped ({hero?.equippedMoves.length ?? 0}/{MAX_EQUIPPED_MOVES})</h3>
      <ul>
        {hero?.equippedMoves.map((m) => (
          <li key={m.id}>
            {m.name}
            <p className="move-descrpition" style={{fontSize : "12px", alignItems: "center"}}>{getMoveDescription(m)}</p>
            <button className="move-action" onClick={() => removeEquippedMove(m.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Learned</h3>
      <ul>
        {hero?.learnedMoves.map((m) => (
          <li key={m.id}>
            {m.name}
          <p className="move-descrpition" style={{fontSize : "12px", alignItems: "center"}}>{getMoveDescription(m)}</p>
            {equippedIds.has(m.id) ? (
              <span className="move-tag">Equipped</span>
            ) : (
              <button className="move-action" onClick={() => equipMove(m.id)} disabled={full}>
                {full ? "Full" : "Equip"}
              </button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => setScreen("map")}>Back</button>
    </div>
  );
}
