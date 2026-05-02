import type {
  StartRunResponse,
  NextMoveRequest,
  NextMoveResponse,
} from "@jobfair/shared";


const BASE = "/api";

export async function fetchRunConfig(): Promise<StartRunResponse> {
  const res = await fetch(`${BASE}/run/start`);
  if (!res.ok) throw new Error(`run/start failed: ${res.status}`);
  return res.json();
}

export async function fetchNextMonsterMove(
  body: NextMoveRequest
): Promise<NextMoveResponse> {
  const params = new URLSearchParams({ state: JSON.stringify(body) });
  const res = await fetch(`${BASE}/battle/next-move?${params}`);
  if (!res.ok) throw new Error(`battle/next-move failed: ${res.status}`);
  return res.json();
}
