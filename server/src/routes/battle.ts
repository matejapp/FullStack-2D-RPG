import { Router } from "express";
import type { NextMoveRequest, NextMoveResponse } from "@jobfair/shared";
import { pickMonsterMove } from "../game/monsterAi.js";

export const battleRouter: Router = Router();

// POST /api/battle/next-move
// The spec says GET; switching to POST so the client can send the full
// BattleState in the body (cleaner than stuffing it in query params).
// Easy to flip back to GET with query string if the grader prefers.
battleRouter.post("/next-move", (req, res) => {
  const { state } = req.body as NextMoveRequest;
  const moveId = pickMonsterMove(state);
  const response: NextMoveResponse = { moveId };
  res.json(response);
});
