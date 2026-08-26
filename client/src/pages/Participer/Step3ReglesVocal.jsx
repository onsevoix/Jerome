import { useState } from "react";

export default function Step3ReglesVocal({ onNext, onBack }) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="form-card">
      <h3>Quelles sont les règles pour le vocal ?</h3>
      <p>C'est très simple, votre vocal a un début, un milieu, une fin 😊</p>

      <p>
        <strong className="rule-step-label">Pour le début :</strong> votre vocal doit commencer par « Hello Mahé, c'est{" "}
        <span className="rule-placeholder">VOTRE PRÉNOM</span>, j'ai{" "}
        <span className="rule-placeholder">ÂGE</span>, et j'habite à{" "}
        <span className="rule-placeholder">VILLE OU RÉGION</span> ».
      </p>

      <p>
        <strong className="rule-step-label">Pour le milieu :</strong> Présentez-vous en listant au moins 30 choses que vous
        aimez et qui vous définissent vraiment. Pas les choses que tout le monde aime, mais les
        petites choses du quotidien qui vous caractérisent et vous définissent.
      </p>

      <button
        type="button"
        className="rule-example-toggle"
        aria-expanded={showExamples}
        onClick={() => setShowExamples((v) => !v)}
      >
        {showExamples ? "Masquer l'exemple" : "Voir un exemple"}
        <svg className="rule-example-toggle__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showExamples && (
        <div className="rule-example">
          <p className="rule-example__bad">
            ❌ J'aime le chocolat, aller au ciné, les vacances et voir mes potes.
          </p>
          <p className="rule-example__good">
            ✅ J'aime partir en vacances dans les pays froids (même en été), j'aime aller au
            cinéma mais je déteste y aller avec quelqu'un, je préfère débattre avec mes potes
            plutôt que raconter ma vie, j'adore les jeux de société mais qu'entre novembre et
            février, quand il fait vraiment froid.
          </p>
        </div>
      )}

      <p>
        <em>PS : ne cherchez pas à vous vendre, dites-nous ce que vous ressentez au fond de vous.</em>
      </p>

      <p>
        <strong className="rule-step-label">Pour la fin :</strong> terminez votre vocal en nous en disant plus sur ce que vous
        recherchez aujourd'hui. N'hésitez pas à donner quelques green flags et quelques red flags
        🚩
      </p>

      <div className="funnel-actions">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Retour
        </button>
        <button type="button" className="btn" onClick={onNext}>
          Suivant
        </button>
      </div>
    </div>
  );
}
