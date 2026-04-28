import { Router } from "express";
import type { StartRunResponse } from "@jobfair/shared";
import { buildRunConfig } from "../game/runBuilder.js";

export const runRouter: Router = Router();

// GET /api/run/start
// Called once at the start of a run. Returns the 5 monsters, their stats,
// movesets, and the hero's starting state.
runRouter.get("/start", (_req, res) => {
  const config: StartRunResponse = buildRunConfig();
  res.json(config);
});
