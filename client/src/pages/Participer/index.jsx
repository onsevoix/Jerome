import { useState } from "react";
import Step1Intro from "./Step1Intro.jsx";
import Step2Regles from "./Step2Regles.jsx";
import Step3ReglesVocal from "./Step3ReglesVocal.jsx";
import Step4Vocal from "./Step4Vocal.jsx";
import Step5Formulaire from "./Step5Formulaire.jsx";

const TOTAL_STEPS = 5;

export default function Participer() {
  const [step, setStep] = useState(1);
  const [vocalFile, setVocalFile] = useState(null);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <section>
      <h2 className="page__title page__title--centered">Participer</h2>
      <p className="page__lead page__lead--centered">
        Vous cherchez l'amour et souhaitez participer, vous êtes au bon endroit.
      </p>

      <div className="funnel-steps">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span key={i} className={`funnel-steps__dot ${i + 1 <= step ? "active" : ""}`} />
        ))}
      </div>

      {step === 1 && <Step1Intro onNext={next} />}
      {step === 2 && <Step2Regles onNext={next} onBack={back} />}
      {step === 3 && <Step3ReglesVocal onNext={next} onBack={back} />}
      {step === 4 && (
        <Step4Vocal vocalFile={vocalFile} setVocalFile={setVocalFile} onNext={next} onBack={back} />
      )}
      {step === 5 && <Step5Formulaire vocalFile={vocalFile} onBack={back} />}
    </section>
  );
}
