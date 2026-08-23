export default function Step3ReglesVocal({ onNext, onBack }) {
  return (
    <div className="form-card">
      <h3>Quelles sont les règles pour le vocal ?</h3>
      <p>C'est très simple, votre vocal a un début, un milieu, une fin :)</p>

      <p>
        <strong>Pour le début :</strong> votre vocal doit commencer par « Hello Mahé, c'est
        (VOTRE PRÉNOM), j'habite à (VILLE OU RÉGION), et j'ai (ÂGE) ».
      </p>

      <p>
        <strong>Pour le milieu :</strong> listez au moins 30 choses que vous aimez et qui vous
        définissent vraiment. Pas les choses que tout le monde aime, mais les petites choses qui
        vous caractérisent et vous définissent.
      </p>

      <div className="rule-example">
        <p className="rule-example__bad">
          ❌ J'aime le chocolat, aller au ciné, les vacances et voir mes potes.
        </p>
        <p className="rule-example__good">
          ✅ J'aime partir en vacances dans les pays froids (même en été), j'aime aller au cinéma
          mais je déteste y aller avec quelqu'un, je préfère débattre avec mes potes plutôt que
          raconter ma vie, j'adore les jeux de société mais qu'entre octobre et février.
        </p>
      </div>

      <p>
        <em>PS : ne cherchez pas à vous vendre, dites-nous ce que vous ressentez au fond de vous.</em>
      </p>

      <p>
        <strong>Pour la fin :</strong> trouvez votre propre manière de conclure, en une phrase.
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
