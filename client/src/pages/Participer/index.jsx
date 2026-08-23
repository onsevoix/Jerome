import { useState } from "react";
import Step1Intro from "./Step1Intro.jsx";
import Step2Regles from "./Step2Regles.jsx";
import Step3ReglesVocal from "./Step3ReglesVocal.jsx";
import Step4Formulaire from "./Step4Formulaire.jsx";

const TOTAL_STEPS = 4;

export default function Participer() {
  const [step, setStep] = useState(1);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <section>
      <h2 className="page__title page__title--centered">Participer</h2>

      <div className="funnel-steps">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span key={i} className={`funnel-steps__dot ${i + 1 <= step ? "active" : ""}`} />
        ))}
      </div>

      {step === 1 && <Step1Intro onNext={next} />}
      {step === 2 && <Step2Regles onNext={next} onBack={back} />}
      {step === 3 && <Step3ReglesVocal onNext={next} onBack={back} />}
      {step === 4 && <Step4Formulaire onBack={back} />}
    </section>
  );
}
