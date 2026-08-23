export default function Step3ReglesVocal({ onNext, onBack }) {
  return (
    <div className="form-card">
      <h3>Quelles sont les règles pour le vocal ?</h3>
      <p>C'est très simple, ton vocal a un début, un milieu, une fin :)</p>

      <p>
        <strong>Pour le début :</strong> ton vocal doit commencer par « Hello Mahé, c'est
        (TON PRÉNOM), j'habite à (VILLE OU RÉGION), et j'ai (ÂGE) ».
      </p>

      <p>
        <strong>Pour le milieu :</strong> liste au moins 30 choses que tu aimes et qui te
        définissent vraiment. Pas les choses que tout le monde aime, mais les petites choses qui
        te caractérisent et te définissent.
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
        <em>PS : ne cherche pas à te vendre, dis-nous ce que tu ressens au fond de toi.</em>
      </p>

      <p>
        <strong>Pour la fin :</strong> trouve ta propre manière de conclure, en une phrase.
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
