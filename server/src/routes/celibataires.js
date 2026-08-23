import { Router } from "express";
import { getCelibataireOptions } from "../airtable.js";

const router = Router();

// Repli utilisé si Airtable n'est pas configuré, ou si le champ "Célibataire"
// n'a pas été trouvé dans la base (nom de table/champ à vérifier).
const FALLBACK = ["Épisode 12 — Léa", "Épisode 13 — Thomas", "Épisode 14 — Nour"];

router.get("/", async (_req, res) => {
  try {
    const options = await getCelibataireOptions();
    res.json({ celibataires: options ?? FALLBACK, live: Boolean(options) });
  } catch (err) {
    console.error("[celibataires] échec de récupération depuis Airtable :", err);
    res.json({ celibataires: FALLBACK, live: false });
  }
});

export default router;
