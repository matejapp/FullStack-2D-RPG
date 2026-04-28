import type {
  StartRunResponse,
  NextMoveRequest,
  NextMoveResponse,
} from "@jobfair/shared";

// Vite dev proxy forwards /api -> http://localhost:3001 (see vite.config.ts).
const BASE = "/api";

export async function fetchRunConfig(): Promise<StartRunResponse> {
  const res = await fetch(`${BASE}/run/start`);
  if (!res.ok) throw new Error(`run/start failed: ${res.status}`);
  return res.json();
}

export async function fetchNextMonsterMove(
  body: NextMoveRequest
): Promise<NextMoveResponse> {
  const res = await fetch(`${BASE}/battle/next-move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`battle/next-move failed: ${res.status}`);
  return res.json();
}
