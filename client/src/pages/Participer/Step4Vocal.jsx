import { useEffect, useRef, useState } from "react";

export default function Step4Vocal({ vocalFile, setVocalFile, onNext, onBack }) {
  const [vocalMode, setVocalMode] = useState("upload"); // "upload" | "record"
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordError, setRecordError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchMode(mode) {
    if (isRecording) return;
    setVocalMode(mode);
    setVocalFile(null);
    setRecordError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  async function startRecording() {
    setRecordError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const file = new File([blob], "vocal-enregistre.webm", { type: blob.type });
        setVocalFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((track) => track.stop());
        clearInterval(timerRef.current);
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch (err) {
      setRecordError(
        "Impossible d'accéder au micro. Vérifiez les autorisations de votre navigateur, ou déposez un fichier audio à la place."
      );
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function reRecord() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setVocalFile(null);
    setRecordSeconds(0);
  }

  return (
    <div className="form-card">
      <h3>Votre vocal</h3>

      <div className="field">
        <div className="vocal-tabs">
          <button
            type="button"
            className={`vocal-tabs__btn ${vocalMode === "upload" ? "active" : ""}`}
            onClick={() => switchMode("upload")}
          >
            Uploader un fichier
          </button>
          <button
            type="button"
            className={`vocal-tabs__btn ${vocalMode === "record" ? "active" : ""}`}
            onClick={() => switchMode("record")}
          >
            Enregistrer directement
          </button>
        </div>

        {vocalMode === "upload" && (
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setVocalFile(e.target.files?.[0] ?? null)}
          />
        )}

        {vocalMode === "record" && (
          <div className="recorder">
            {!previewUrl && !isRecording && (
              <button type="button" className="btn btn--secondary" onClick={startRecording}>
                🔴 Commencer l'enregistrement
              </button>
            )}

            {isRecording && (
              <div className="recorder__active">
                <span className="recorder__timer">⏱ {recordSeconds}s</span>
                <button type="button" className="btn" onClick={stopRecording}>
                  ⏹ Arrêter
                </button>
              </div>
            )}

            {previewUrl && !isRecording && (
              <div className="recorder__preview">
                <audio controls src={previewUrl} />
                <button type="button" className="btn btn--secondary" onClick={reRecord}>
                  🔁 Recommencer
                </button>
              </div>
            )}

            {recordError && <p className="field__hint field__hint--error">{recordError}</p>}
          </div>
        )}
      </div>

      <div className="funnel-actions">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Retour
        </button>
        <button type="button" className="btn" onClick={onNext} disabled={!vocalFile}>
          Suivant
        </button>
      </div>
    </div>
  );
}
