import lamejs from "@breezystack/lamejs";

function floatTo16BitPCM(float32Array) {
  const output = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

// Convertit un blob audio (webm, mp4, etc.) en MP3, quel que soit le
// navigateur/appareil d'origine de l'enregistrement — le MP3 se lit
// nativement partout, y compris Safari/iPhone (contrairement au webm).
export async function encodeToMp3(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();

  let audioBuffer;
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } finally {
    audioContext.close();
  }

  const channels = Math.min(audioBuffer.numberOfChannels, 2);
  const sampleRate = audioBuffer.sampleRate;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);

  const left = floatTo16BitPCM(audioBuffer.getChannelData(0));
  const right = channels === 2 ? floatTo16BitPCM(audioBuffer.getChannelData(1)) : null;

  const blockSize = 1152;
  const mp3Chunks = [];

  for (let i = 0; i < left.length; i += blockSize) {
    const leftChunk = left.subarray(i, i + blockSize);
    const mp3buf = right
      ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + blockSize))
      : encoder.encodeBuffer(leftChunk);
    if (mp3buf.length > 0) mp3Chunks.push(mp3buf);
  }

  const finalBuf = encoder.flush();
  if (finalBuf.length > 0) mp3Chunks.push(finalBuf);

  return new Blob(mp3Chunks, { type: "audio/mp3" });
}
