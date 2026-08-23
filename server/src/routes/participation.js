import { Router } from "express";
import multer from "multer";
import { createRecord, uploadAttachmentToRecord } from "../airtable.js";

const router = Router();

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

router.post("/", upload.single("vocal"), async (req, res) => {
  const { prenom, ville, age, email, instagram } = req.body ?? {};
  const file = req.file;

  if (!prenom || !ville || !age || !email || !instagram) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  if (!file) {
    return res.status(400).json({ error: "Merci de déposer un fichier audio." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide." });
  }

  try {
    const tableName = process.env.AIRTABLE_PARTICIPATION_TABLE || "Participations";
    const record = await createRecord(tableName, {
      Prénom: prenom,
      Ville: ville,
      Âge: Number(age),
      Email: email,
      Instagram: instagram,
    });

    await uploadAttachmentToRecord({
      tableName,
      recordId: record.id,
      fieldName: "Vocal",
      buffer: file.buffer,
      filename: file.originalname,
      contentType: file.mimetype,
    });

    res.status(201).json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[participation] échec de l'envoi vers Airtable :", err);
    res.status(502).json({ error: "Impossible d'enregistrer la candidature pour le moment." });
  }
});

export default router;
