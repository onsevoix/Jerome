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
