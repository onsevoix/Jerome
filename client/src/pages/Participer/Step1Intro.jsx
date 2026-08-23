export default function Step1Intro({ onNext }) {
  return (
    <div className="form-card">
      <h3>Comment ça fonctionne ?</h3>
      <p>
        Pour participer, c'est très simple : vous déposez un vocal en suivant les consignes des
        pages suivantes. S'il est retenu, on vous le fait savoir, et votre épisode sera diffusé
        sur toutes nos plateformes d'écoute.
      </p>
      <div className="funnel-actions">
        <button type="button" className="btn" onClick={onNext}>
          Suivant
        </button>
      </div>
    </div>
  );
}
