import { Router } from "express";
import type { StartRunResponse } from "@jobfair/shared";
import { buildRunConfig } from "../game/runBuilder.js";

export const runRouter: Router = Router();


runRouter.get("/start", (_req, res) => {
  const config: StartRunResponse = buildRunConfig();
  res.json(config);
});
