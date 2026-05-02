import { Router } from "express";
import type { NextMoveRequest, NextMoveResponse } from "@jobfair/shared";
import { pickMonsterMove } from "../game/monsterAi.js";

export const battleRouter: Router = Router();


battleRouter.get("/next-move", (req, res) => {
  const { state } = JSON.parse(req.query.state as string) as NextMoveRequest;
  const moveId = pickMonsterMove(state);
  const response: NextMoveResponse = { moveId };
  res.json(response);
});
