import { useEffect, useRef, useState } from "react";
import { encodeToMp3 } from "../../lib/mp3Encode.js";
import { socialLinks } from "../../data/links.js";

export default function Step4Vocal({ vocalFile, setVocalFile, onNext, onBack }) {
  const [vocalMode, setVocalMode] = useState("upload"); // "upload" | "record"
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordError, setRecordError] = useState(null);
  const [converting, setConverting] = useState(false);

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

      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        clearInterval(timerRef.current);

        const rawBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });

        // Convertit systematiquement en MP3 : le format d'origine (webm sur
        // Chrome/Firefox, parfois mp4 sur Safari) n'est pas lisible partout,
        // le MP3 l'est toujours, y compris sur iPhone.
        setConverting(true);
        try {
          const mp3Blob = await encodeToMp3(rawBlob);
          const file = new File([mp3Blob], "vocal-enregistre.mp3", { type: "audio/mp3" });
          setVocalFile(file);
          setPreviewUrl(URL.createObjectURL(mp3Blob));
        } catch (err) {
          setRecordError(
            "Impossible de préparer votre vocal pour l'envoi. Réessayez, ou déposez un fichier audio à la place."
          );
        } finally {
          setConverting(false);
        }
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

  // Un fichier depose qui n'est pas deja un vrai MP3 (AAC/MP4 d'un dictaphone,
  // .mov, .ogg...) est converti en MP3, lisible partout y compris sur iPhone.
  // Si la conversion echoue, on envoie l'original : le serveur en deduit le bon
  // format a partir du contenu.
  async function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    setRecordError(null);
    if (!file) {
      setVocalFile(null);
      return;
    }
    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const isMp3 =
      (head[0] === 0x49 && head[1] === 0x44 && head[2] === 0x33) ||
      (head[0] === 0xff && (head[1] & 0xe0) === 0xe0);
    if (isMp3) {
      setVocalFile(file);
      return;
    }
    setVocalFile(null);
    setConverting(true);
    try {
      const mp3Blob = await encodeToMp3(file);
      setVocalFile(new File([mp3Blob], "vocal.mp3", { type: "audio/mp3" }));
    } catch (err) {
      setVocalFile(file);
    } finally {
      setConverting(false);
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
      <h3>Déposez votre vocal</h3>

      <p className="page__lead vocal-tips__intro">Derniers conseils pour votre vocal :</p>
      <ul className="vocal-tips">
        <li>Soyez le plus naturel·le possible 🍀</li>
        <li>Ne lisez pas de texte 🤓</li>
        <li>Parlez près de votre micro 🎙️</li>
        <li>Ne dépassez pas 3 minutes ⏳</li>
      </ul>

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
          <div className="vocal-panel">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
            {converting && <p className="field__hint">Préparation de votre vocal…</p>}
            {recordError && <p className="field__hint field__hint--error">{recordError}</p>}
          </div>
        )}

        {vocalMode === "record" && (
          <div className="vocal-panel">
            {!previewUrl && !isRecording && !converting && (
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

            {converting && <p className="field__hint">Préparation de votre vocal…</p>}

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

      <p className="page__lead page__lead--centered">
        Une question ou un problème ? Envoyez-nous un message sur{" "}
        <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>

      <div className="funnel-actions">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Retour
        </button>
        <button type="button" className="btn" onClick={onNext} disabled={!vocalFile || converting}>
          Suivant
        </button>
      </div>
    </div>
  );
}
