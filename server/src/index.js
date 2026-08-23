import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import declaRouter from "./routes/decla.js";
import participationRouter from "./routes/participation.js";
import celibatairesRouter from "./routes/celibataires.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/decla", declaRouter);
app.use("/api/participation", participationRouter);
app.use("/api/celibataires", celibatairesRouter);

// Gestion des erreurs (ex: fichier audio trop volumineux)
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Erreur lors de l'upload : ${err.message}` });
  }
  console.error(err);
  res.status(500).json({ error: "Erreur serveur inattendue." });
});

app.listen(PORT, () => {
  console.log(`[server] On se voix ? API disponible sur http://localhost:${PORT}`);
});
