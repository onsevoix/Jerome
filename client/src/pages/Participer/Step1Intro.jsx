export default function Step1Intro({ onNext }) {
  return (
    <div className="form-card">
      <h3>Comment ça fonctionne ?</h3>
      <p>
        Pour participer, c'est très simple : tu déposes un vocal en suivant les consignes des
        pages suivantes. S'il est retenu, on te le fait savoir, et ton épisode sera diffusé sur
        toutes nos plateformes d'écoute.
      </p>
      <div className="funnel-actions">
        <button type="button" className="btn" onClick={onNext}>
          Suivant
        </button>
      </div>
    </div>
  );
}
