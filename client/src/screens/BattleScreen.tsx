import { useEffect, useRef, useState } from "react";
import type { BattleState, Move,Hero } from "@jobfair/shared";
import { useGameStore } from "../store/gameStore.js";
import { fetchNextMonsterMove } from "../api/client.js";
import { applyHeroMove, applyMonsterMove, endOfTurn } from "../game/battleEngine.js";
import { getSpriteUrl } from "../game/sprites.js";
import { comoputeWarriorDamage } from "../game/combat.js";

function moveHint(move: Move): string {
  const hero = useGameStore.getState().hero;
  const e = move.effect;
  switch (e.kind) {
    case "damage":              return (move.type === "physical" ? "Atk" : "Mag") + " " + (hero ? comoputeWarriorDamage(move, hero.stats) : "?") + " dmg";
    case "heal":                return "Heal " + e.baseValue;
    case "damage_and_heal":     return "Atk " + (hero ? comoputeWarriorDamage(move, hero.stats) : "?") + " dmg + drain";
    case "buff":                return e.stat + " +" + e.amount + " (" + e.durationTurns + "t)";
    case "debuff":              return e.stat + " -" + e.amount + " (" + e.durationTurns + "t)";
    case "damage_and_debuff":   return "Atk " + (hero ? comoputeWarriorDamage(move, hero.stats) : "?") + " dmg + debuff";
    case "self_buff_with_cost": return e.stat + " +" + e.amount + " (-" + e.hpCost + " HP)";
    default: return "";
  }
}


function MonsterMoveList({ moves }: { moves: Move[] }) {
  return (
    <div className="monster-move-list">
      {moves.map((m) => (
        <div key={m.id} className={`monster-move-chip ${m.type}`}>
          <span className="chip-name">{m.name}</span>
          <span className="chip-hint">{moveHint(m)}</span>
        </div>
      ))}
    </div>
  );
}

function HpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.max(0, (current / max) * 100);
  const cls = pct > 50 ? "" : pct > 25 ? " medium" : " low";
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
      <div className="hp-label">{current} / {max} HP</div>
      <div className="hp-bar-track">
        <div className={"hp-bar-fill" + cls} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

function ModifierRow({ mods }: { mods: { stat: string; amount: number; remainingTurns: number }[] }) {
  if (mods.length === 0) return <div className="modifiers-row" />;
  const text = mods
    .map((m) => m.stat + " " + (m.amount > 0 ? "+" : "") + m.amount + " (" + m.remainingTurns + "t)")
    .join("  /  ");
  return <div className="modifiers-row">{text}</div>;
}

type Phase = "idle" | "busy" | "victory" | "defeat";

export function BattleScreen() {
  const { runId, hero, encounters, encounterIndex, finishBattle } = useGameStore();
  const monster = encounters[encounterIndex];

  const [bs, setBs] = useState<BattleState | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [learnedMove, setLearnedMove] = useState<Move | null>(null);

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hero || !monster || !runId) return;
    const initial: BattleState = {
      runId,
      encounterIndex,
      turn: 0,
      hero: {
        currentHp: hero.stats.health,
        modifiers: [],
        stats: hero.stats,
        equippedMoves: hero.equippedMoves,
      },
      monster: {
        currentHp: monster.stats.health,
        modifiers: [],
        stats: monster.stats,
        moves: monster.moves,
        id: monster.id,
      },
    };
    setBs(initial);
    setLog(["A wild " + monster.name + " appears!"]);

  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  async function onMove(moveId: string) {
    if (!bs || phase !== "idle") return;
    setPhase("busy");

    const heroResult = applyHeroMove(bs, moveId);
    let state = heroResult.nextState;
    setBs(state);
    setLog((prev) => [...prev, heroResult.log]);

    if (state.monster.currentHp <= 0) {
      setLearnedMove(pickDrop(monster!.moves, hero!.learnedMoves));
      setPhase("victory");
      return;
    }

    try {
      const { moveId: monsterMoveId } = await fetchNextMonsterMove({ state });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const monsterResult = applyMonsterMove(state, monsterMoveId);
      state = monsterResult.nextState;
      state = endOfTurn(state);
      setBs(state);
      setLog((prev) => [...prev, monsterResult.log]);
    } catch {
      setLog((prev) => [...prev, "Monster hesitates..."]);
    }

    if (state.hero.currentHp <= 0) {
      setPhase("defeat");
      return;
    }

    setPhase("idle");
  }

  function pickDrop(monsterMoves: Move[], known: Move[]): Move {
    const knownIds = new Set(known.map((m) => m.id));
    const candidates = monsterMoves.filter((m) => !knownIds.has(m.id));
    const pool = candidates.length > 0 ? candidates : monsterMoves;
    return pool[Math.floor(Math.random() * pool.length)]!;
  }

  function onLearn()         { finishBattle(true, learnedMove?.id); }
  function onSkip()          { finishBattle(true, undefined); }
  function onDefeatConfirm() { finishBattle(false); }

  if (!bs || !monster || !hero) {
    return <div className="screen">Loading battle...</div>;
  }

  const monsterSpriteKey = monster.spriteKey ?? monster.id;

  return (
    <div className="screen battle" style={{ backgroundImage: `url(${getSpriteUrl(monster.backgroundSprite ?? "")})` }}>
      <div className="battle-grid">
        <div className="battle-arena">
          <div className="combatant">
            <div className="combatant-name">Knight (you)</div>
            <img src={getSpriteUrl("hero")} alt="Hero" />
            <HpBar current={bs.hero.currentHp} max={bs.hero.stats.health} />
            <ModifierRow mods={bs.hero.modifiers} />
          </div>
          <div className="middle-ground"><img src="/assets/sword.png" alt="" /></div>
          <div className="combatant">
            <div className="combatant-name">{monster.name}</div>
            <MonsterMoveList moves={monster.moves} />
            <img src={getSpriteUrl(monsterSpriteKey)} alt={monster.name} />
            <HpBar current={bs.monster.currentHp} max={bs.monster.stats.health} />
            <ModifierRow mods={bs.monster.modifiers} />
          </div>
        </div>

        <div className="moves-grid">
          {bs.hero.equippedMoves.map((move) => (
            <button
              key={move.id}
              className="move-btn"
              disabled={phase !== "idle"}
              onClick={() => onMove(move.id)}
            >
              <span className="move-btn-name">{move.name}</span>
              <span className="move-btn-hint">{moveHint(move)}</span>
            </button>
          ))}
        </div>
        
      <div className="battle-log" ref={logRef}>
        {log.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        {phase === "busy" && <p style={{ color: "#555" }}>...</p>}
      </div>
      </div>
      

      {phase === "victory" && (
        <div className="overlay">
          <div className="overlay-card">
            <h2>Victory!</h2>
            <p>You defeated {monster.name}!</p>
            {learnedMove && (
              <>
                <p>You can learn a new move:</p>
                <div className="move-preview">
                  <div className="move-preview-name">{learnedMove.name}</div>
                  <div className="move-preview-desc">
                    {learnedMove.description ?? moveHint(learnedMove)}
                  </div>
                </div>
                <div className="overlay-actions">
                  <button onClick={onLearn}>Learn it</button>
                  <button onClick={onSkip}>Skip</button>
                </div>
              </>
            )}
            {!learnedMove && (
              <div className="overlay-actions">
                <button onClick={onSkip}>Continue</button>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "defeat" && (
        <div className="overlay">
          <div className="overlay-card">
            <h2>Defeated...</h2>
            <p>{monster.name} got the better of you.</p>
            <p>Better luck next run.</p>
            <div className="overlay-actions">
              <button onClick={onDefeatConfirm}>Back to Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
