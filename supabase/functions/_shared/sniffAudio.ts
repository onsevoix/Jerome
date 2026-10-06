// Verifie la signature binaire (les premiers octets) d'un fichier plutot que
// de faire confiance a son nom ou a son Content-Type declare, tous les deux
// facilement falsifiables. N'accepte que ce qui ressemble reellement a un
// format audio courant.
export function isLikelyAudio(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;

  // MP3 : ID3 tag, ou synchro de trame MPEG (0xFFEx a 0xFFFx)
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return true;
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return true;

  // WAV : "RIFF"...."WAVE"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x45
  ) {
    return true;
  }

  // M4A / MP4 : boite "ftyp" a l'offset 4
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return true;
  }

  // OGG : "OggS"
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
    return true;
  }

  // WEBM / MKV : en-tete EBML
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return true;
  }

  return false;
}

// Determine l'extension et le Content-Type reels d'apres la signature binaire,
// pour ne pas se fier au nom du fichier envoye. Un fichier AAC/MP4 nomme ".mp3"
// etait servi comme "audio/mpeg" et refuse par Safari sur iPhone.
export function detectAudioType(bytes: Uint8Array): { ext: string; mime: string } | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return { ext: "mp3", mime: "audio/mpeg" };
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return { ext: "mp3", mime: "audio/mpeg" };
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x45) {
    return { ext: "wav", mime: "audio/wav" };
  }
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    // Marque "qt  " = QuickTime (.mov), sinon MP4/M4A
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    return brand === "qt  " ? { ext: "mov", mime: "video/quicktime" } : { ext: "m4a", mime: "audio/mp4" };
  }
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return { ext: "ogg", mime: "audio/ogg" };
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return { ext: "webm", mime: "audio/webm" };
  return null;
}
