import { Router } from "express";
import { createRecord } from "../airtable.js";

const router = Router();
const MIN_MESSAGE_LENGTH = 500;

router.post("/", async (req, res) => {
  const { prenom, celibataire, message, email } = req.body ?? {};

  if (!prenom || !celibataire || !message || !email) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Le message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères.`,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide." });
  }

  try {
    const tableName = process.env.AIRTABLE_DECLA_TABLE || "Declas";
    const record = await createRecord(tableName, {
      Prénom: prenom,
      Célibataire: celibataire,
      Message: message,
      Email: email,
    });
    res.status(201).json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[decla] échec de l'envoi vers Airtable :", err);
    res.status(502).json({ error: "Impossible d'enregistrer la décla pour le moment." });
  }
});

export default router;
