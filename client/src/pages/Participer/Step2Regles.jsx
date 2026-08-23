export default function Step2Regles({ onNext, onBack }) {
  return (
    <div className="form-card">
      <h3>Comment être retenu·e ?</h3>
      <p>
        Sur "On se voix ?", ce qui compte, ce n'est pas à quel point tu es impressionnant⋅e, mais
        à quel point tu es authentique, vrai⋅e, sincère. Ce sont les petits riens du quotidien qui
        rendent attachant⋅e — pas un CV, ni le nombre de voyages qu'on a faits dans sa vie.
      </p>
      <div className="funnel-actions">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Retour
        </button>
        <button type="button" className="btn" onClick={onNext}>
          J'ai compris, participer
        </button>
      </div>
    </div>
  );
}
