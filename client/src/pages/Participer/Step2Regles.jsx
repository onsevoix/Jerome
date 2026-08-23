export default function Step2Regles({ onNext, onBack }) {
  return (
    <div className="form-card">
      <h3>Comment être retenu·e ?</h3>
      <p>
        Sur "On se voix ?", ce qui compte ce n'est pas votre physique ou votre CV, mais votre
        authenticité et votre sincérité. On le sait, ce sont les petits riens du quotidien qui
        rendent attachant⋅e.
      </p>
      <div className="funnel-actions">
        <button type="button" className="btn btn--secondary btn--sm" onClick={onBack}>
          Retour
        </button>
        <button type="button" className="btn btn--sm" onClick={onNext}>
          J'ai compris, participer
        </button>
      </div>
    </div>
  );
}
