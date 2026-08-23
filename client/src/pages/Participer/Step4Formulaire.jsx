import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { sendParticipation } from "../../lib/api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialForm = { prenom: "", ville: "", age: "", email: "", instagram: "" };

export default function Step4Formulaire({ onBack }) {
  const [form, setForm] = useState(initialForm);
  const [vocalMode, setVocalMode] = useState("upload"); // "upload" | "record"
  const [vocalFile, setVocalFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordError, setRecordError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailOk = EMAIL_REGEX.test(form.email);
  const canSubmit =
    form.prenom && form.ville && form.age && emailOk && form.instagram && vocalFile && !submitting;

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function switchMode(mode) {
    if (isRecording) return;
    setVocalMode(mode);
    setVocalFile(null);
    setRecordError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  async function startRecording() {
    setRecordError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const file = new File([blob], "vocal-enregistre.webm", { type: blob.type });
        setVocalFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((track) => track.stop());
        clearInterval(timerRef.current);
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch (err) {
      setRecordError(
        "Impossible d'accéder au micro. Vérifiez les autorisations de votre navigateur, ou déposez un fichier audio à la place."
      );
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function reRecord() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setVocalFile(null);
    setRecordSeconds(0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setStatus(null);
    try {
      await sendParticipation({ ...form, vocal: vocalFile });
      setSent(true);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="form-card confirmation">
        <p className="confirmation__emoji">🎙️</p>
        <p className="confirmation__text">
          Merci {form.prenom}, nous avons bien reçu ton vocal. Si tu es retenu⋅e, nous te
          recontacterons dans les prochaines semaines.
        </p>
        <p>En attendant, découvre les épisodes déjà en ligne :</p>
        <Link to="/ecouter" className="btn confirmation__link">
          Écouter le podcast 🎧
        </Link>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Dépose ton vocal</h3>

      <div className="field">
        <label htmlFor="prenom" className="required">
          Prénom
        </label>
        <input id="prenom" type="text" value={form.prenom} onChange={updateField("prenom")} required />
      </div>

      <div className="field">
        <label htmlFor="ville" className="required">
          Ville ou région
        </label>
        <input id="ville" type="text" value={form.ville} onChange={updateField("ville")} required />
      </div>

      <div className="field">
        <label htmlFor="age" className="required">
          Âge
        </label>
        <input
          id="age"
          type="number"
          min="18"
          max="120"
          value={form.age}
          onChange={updateField("age")}
          onWheel={(e) => e.currentTarget.blur()}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="email" className="required">
          Email
        </label>
        <input id="email" type="email" value={form.email} onChange={updateField("email")} required />
        {form.email.length > 0 && !emailOk ? (
          <p className="field__hint field__hint--error">Adresse email invalide.</p>
        ) : (
          <p className="field__hint">🔒 Reste confidentiel, ne sera jamais partagé.</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="instagram" className="required">
          Ton compte Instagram
        </label>
        <input
          id="instagram"
          type="text"
          placeholder="@tonpseudo"
          value={form.instagram}
          onChange={updateField("instagram")}
          required
        />
        <p className="field__hint">🔒 Reste confidentiel, ne sera jamais partagé.</p>
      </div>

      <div className="field">
        <label className="required">Ton vocal</label>

        <div className="vocal-tabs">
          <button
            type="button"
            className={`vocal-tabs__btn ${vocalMode === "upload" ? "active" : ""}`}
            onClick={() => switchMode("upload")}
          >
            Uploader un fichier
          </button>
          <button
            type="button"
            className={`vocal-tabs__btn ${vocalMode === "record" ? "active" : ""}`}
            onClick={() => switchMode("record")}
          >
            Enregistrer directement
          </button>
        </div>

        {vocalMode === "upload" && (
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setVocalFile(e.target.files?.[0] ?? null)}
          />
        )}

        {vocalMode === "record" && (
          <div className="recorder">
            {!previewUrl && !isRecording && (
              <button type="button" className="btn btn--secondary" onClick={startRecording}>
                🔴 Commencer l'enregistrement
              </button>
            )}

            {isRecording && (
              <div className="recorder__active">
                <span className="recorder__timer">⏱ {recordSeconds}s</span>
                <button type="button" className="btn" onClick={stopRecording}>
                  ⏹ Arrêter
                </button>
              </div>
            )}

            {previewUrl && !isRecording && (
              <div className="recorder__preview">
                <audio controls src={previewUrl} />
                <button type="button" className="btn btn--secondary" onClick={reRecord}>
                  🔁 Recommencer
                </button>
              </div>
            )}

            {recordError && <p className="field__hint field__hint--error">{recordError}</p>}
          </div>
        )}
      </div>

      <div className="funnel-actions">
        <button type="button" className="btn btn--secondary" onClick={onBack} disabled={submitting}>
          Retour
        </button>
        <button type="submit" className="btn" disabled={!canSubmit}>
          {submitting ? "Envoi en cours…" : "Envoyer ma candidature"}
        </button>
      </div>

      {status && <p className={`form-status form-status--${status.type}`}>{status.text}</p>}
    </form>
  );
}
