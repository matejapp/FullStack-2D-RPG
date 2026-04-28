import express from "express";
import cors from "cors";
import { runRouter } from "./routes/run.js";
import { battleRouter } from "./routes/battle.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/run", runRouter);
app.use("/api/battle", battleRouter);

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
