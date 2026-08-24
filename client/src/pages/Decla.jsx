import { useEffect, useState } from "react";
import { celibataires as fallbackCelibataires } from "../data/celibataires.js";
import { sendDecla, fetchCelibataires } from "../lib/api.js";
import WritingLoop from "../components/icons/WritingLoop.jsx";

const MIN_MESSAGE_LENGTH = 500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = {
  prenom: "",
  celibataire: "",
  message: "",
  email: "",
};

export default function Decla() {
  const [form, setForm] = useState(initialForm);
  const [celibataires, setCelibataires] = useState(fallbackCelibataires);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetchCelibataires()
      .then((data) => {
        if (data.celibataires?.length) setCelibataires(data.celibataires);
      })
      .catch(() => {
        // on garde la liste de secours en cas d'échec réseau
      });
  }, []);

  const messageLength = form.message.length;
  const messageOk = messageLength >= MIN_MESSAGE_LENGTH;
  const emailOk = EMAIL_REGEX.test(form.email);
  const canSubmit = form.prenom && form.celibataire && emailOk && messageOk && !submitting;

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setStatus(null);
    try {
      await sendDecla(form);
      setSent(true);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <section>
        <h2 className="page__title page__title--centered">Faire une décla</h2>
        <div className="form-card confirmation">
          <p className="confirmation__emoji">💌</p>
          <p className="confirmation__text">
            Merci, ta décla a bien été envoyée à ton crush. Maintenant, il/elle décidera ou non
            de te répondre. On croise les doigts pour toi 🤞
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="page__title page__title--centered">Faire une décla</h2>
      <p className="page__lead page__lead--centered">
        Vous avez eu un crush vocal sur un⋅e célibataire ? Envoyez-lui un mot.
      </p>

      {!started ? (
        <>
          <WritingLoop className="writing-loop" />
          <div className="decla__cta">
            <button type="button" className="btn" onClick={() => setStarted(true)}>
              Je me lance
            </button>
          </div>
        </>
      ) : (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="prenom" className="required">
              Comment t'appelles-tu ?
            </label>
            <input
              id="prenom"
              type="text"
              value={form.prenom}
              onChange={updateField("prenom")}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="celibataire" className="required">
              Sur quel⋅le célibataire as-tu crushé ?
            </label>
            <select
              id="celibataire"
              value={form.celibataire}
              onChange={updateField("celibataire")}
              required
            >
              <option value="" disabled>
                Choisissez…
              </option>
              {celibataires.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="message" className="required">
              Rédige-lui un mot et confie-lui tes secrets
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={updateField("message")}
              required
            />
            <p className={`field__hint ${messageOk ? "field__hint--ok" : ""}`}>
              {messageLength} / {MIN_MESSAGE_LENGTH} caractères minimum
            </p>
          </div>

          <div className="field">
            <label htmlFor="email" className="required">
              Partage ton e-mail pour qu'il ou elle puisse te répondre
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={updateField("email")}
              required
            />
            {form.email.length > 0 && !emailOk && (
              <p className="field__hint field__hint--error">Adresse email invalide.</p>
            )}
          </div>

          <button type="submit" className="btn" disabled={!canSubmit}>
            {submitting ? "Envoi en cours…" : "Envoyer ma décla"}
          </button>

          {status && (
            <p className={`form-status form-status--${status.type}`}>{status.text}</p>
          )}
        </form>
      )}
    </section>
  );
}
