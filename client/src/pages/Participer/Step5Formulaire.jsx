import { useState } from "react";
import { Link } from "react-router-dom";
import { sendParticipation } from "../../lib/api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialForm = { prenom: "", ville: "", age: "", email: "", instagram: "" };

export default function Step5Formulaire({ vocalFile, onBack }) {
  const [form, setForm] = useState(initialForm);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const emailOk = EMAIL_REGEX.test(form.email);
  const canSubmit =
    form.prenom && form.ville && form.age && emailOk && form.instagram && consent && !submitting;

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
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
          Merci {form.prenom}, nous avons bien reçu votre vocal. Si vous êtes retenu⋅e, nous vous
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
      <h3>Dernière étape</h3>

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
          Votre compte Instagram
        </label>
        <input
          id="instagram"
          type="text"
          placeholder="@votrepseudo"
          value={form.instagram}
          onChange={updateField("instagram")}
          required
        />
        <p className="field__hint">🔒 Reste confidentiel, ne sera jamais partagé.</p>
      </div>

      <div className="field field--checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            J'accepte que mon vocal soit diffusé sur les plateformes d'écoute et les réseaux
            sociaux d'<strong className="page__lead-strong">On se voix ?</strong>
          </span>
        </label>
      </div>

      <div className="funnel-actions">
        <button type="button" className="btn btn--secondary btn--sm" onClick={onBack} disabled={submitting}>
          Retour
        </button>
        <button type="submit" className="btn btn--sm" disabled={!canSubmit}>
          {submitting ? "Envoi en cours…" : "Envoyer ma candidature"}
        </button>
      </div>

      {status && <p className={`form-status form-status--${status.type}`}>{status.text}</p>}
    </form>
  );
}
