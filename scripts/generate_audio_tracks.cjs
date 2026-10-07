const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SAMPLE_RATE = 44100;

function createWavHeader(numSamples, numChannels = 2, sampleRate = SAMPLE_RATE) {
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

// Full tempered scale note frequencies
const NOTE_FREQS = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'Ab2': 103.83, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98,
};

// Studio Physical Modeling Note Generator
function addStudioNote(left, right, noteName, startTime, duration, voiceType, volume = 0.25, pan = 0) {
  const freq = NOTE_FREQS[noteName];
  if (!freq) return;

  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const lenSamples = Math.floor(duration * SAMPLE_RATE);
  const endSample = Math.min(startSample + lenSamples, left.length);

  const panL = Math.cos((pan + 1) * Math.PI / 4);
  const panR = Math.sin((pan + 1) * Math.PI / 4);

  // Random micro-pitch variation for acoustic organic warmth (humanization)
  const detuneFactor = 1.0 + (Math.random() - 0.5) * 0.0018;

  for (let s = startSample; s < endSample; s++) {
    const t = (s - startSample) / SAMPLE_RATE;
    const progress = t / duration;

    let env = 1.0;
    let wave = 0;

    if (voiceType === 'acoustic_guitar' || voiceType === 'oud' || voiceType === 'harp') {
      // Natural logarithmic string decay with damping
      const decayRate = voiceType === 'oud' ? 3.8 : voiceType === 'harp' ? 2.5 : 4.0;
      env = Math.exp(-t * (decayRate / duration));

      // Multi-harmonic plucked string with body resonance
      const p = 2 * Math.PI * (freq * detuneFactor) * t;
      wave = Math.sin(p)
           + 0.52 * Math.sin(p * 2) * Math.exp(-t * 1.5)
           + 0.28 * Math.sin(p * 3) * Math.exp(-t * 3.0)
           + 0.12 * Math.sin(p * 4) * Math.exp(-t * 5.0)
           + 0.05 * Math.sin(p * 5) * Math.exp(-t * 7.0);

      // Acoustic body impulse
      if (t < 0.02) {
        wave += (Math.random() - 0.5) * 0.18 * (1 - t / 0.02);
      }
    } else if (voiceType === 'bansuri' || voiceType === 'flute') {
      // Smooth legato envelope: gentle rise, singing sustain, soft release
      const attack = 0.12;
      const release = 0.18;
      if (t < attack) env = Math.sin((t / attack) * (Math.PI / 2));
      else if (progress > 0.8) env = Math.sin(((1 - progress) / 0.2) * (Math.PI / 2));
      else env = 1.0;

      // Authentic Bansuri vibrato (starts after 0.25s)
      const vibratoDepth = t > 0.2 ? Math.min((t - 0.2) * 0.012, 0.018) : 0.002;
      const vibrato = Math.sin(2 * Math.PI * 4.8 * t) * (freq * vibratoDepth);
      const p = 2 * Math.PI * (freq + vibrato) * t;

      // Breathy wooden flute harmonic spectrum (predominantly fundamental + warm 2nd & 3rd)
      wave = Math.sin(p) + 0.32 * Math.sin(p * 2) + 0.12 * Math.sin(p * 3);
      // Soft air breath
      wave += (Math.random() - 0.5) * 0.025;
    } else if (voiceType === 'strings_ensemble' || voiceType === 'cello') {
      // Lush multi-voice acoustic string swell
      const attack = voiceType === 'cello' ? 0.18 : 0.28;
      if (t < attack) env = t / attack;
      else if (progress > 0.78) env = (1 - progress) / 0.22;
      else env = 1.0;

      // 3 detuned string voices for thick orchestral ensemble
      const p1 = 2 * Math.PI * (freq * 0.9975) * t;
      const p2 = 2 * Math.PI * (freq * 1.0025) * t;
      const p3 = 2 * Math.PI * freq * t;
      wave = (Math.sin(p1) + Math.sin(p2) + Math.sin(p3) * 1.2) / 3.0;
      wave += 0.22 * Math.sin(p3 * 2) + 0.08 * Math.sin(p3 * 3);
    } else if (voiceType === 'rhodes_piano') {
      // Neo-soul Rhodes: bell chime transient + warm round tine decay
      env = Math.exp(-t * (2.8 / duration));
      const p = 2 * Math.PI * freq * t;
      wave = Math.sin(p)
           + 0.42 * Math.sin(p * 2.005) * Math.exp(-t * 2.5)
           + 0.18 * Math.sin(p * 3.99) * Math.exp(-t * 4.5);
    } else if (voiceType === 'music_box_bell') {
      // Pristine crystalline bell chime
      env = Math.exp(-t * (2.2 / duration));
      const p = 2 * Math.PI * freq * t;
      wave = Math.sin(p)
           + 0.65 * Math.sin(p * 2.01) * Math.exp(-t * 2.0)
           + 0.35 * Math.sin(p * 4.02) * Math.exp(-t * 4.0)
           + 0.15 * Math.sin(p * 6.03) * Math.exp(-t * 6.0);
    } else if (voiceType === 'warm_sub_bass') {
      // Deep foundational warm bass
      env = Math.exp(-t * 1.6);
      const p = 2 * Math.PI * freq * t;
      wave = Math.sin(p) + 0.25 * Math.sin(p * 2) + 0.05 * Math.sin(p * 3);
    }

    const val = wave * env * volume;
    left[s] += val * panL;
    right[s] += val * panR;
  }
}

// Gentle studio percussion (warm, never harsh or irritating)
function addSoftPercussion(left, right, type, time, vol = 0.18) {
  const startSample = Math.floor(time * SAMPLE_RATE);
  const duration = type === 'soft_kick' ? 0.18 : type === 'shaker' ? 0.06 : 0.12;
  const lenSamples = Math.floor(duration * SAMPLE_RATE);
  const endSample = Math.min(startSample + lenSamples, left.length);

  for (let s = startSample; s < endSample; s++) {
    const t = (s - startSample) / SAMPLE_RATE;
    let wave = 0;
    if (type === 'soft_kick') {
      // Warm round kick, lowpass feel
      const pitch = 95 * Math.exp(-t * 28);
      wave = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 14);
    } else if (type === 'shaker') {
      // Subtle silky acoustic shaker
      wave = (Math.random() - 0.5) * Math.exp(-t * 50);
    } else if (type === 'finger_snap') {
      // Organic finger snap
      wave = ((Math.random() - 0.5) * 0.6 + Math.sin(2 * Math.PI * 440 * t) * 0.4) * Math.exp(-t * 35);
    } else if (type === 'velvet_rimshot') {
      wave = ((Math.random() - 0.5) * 0.5 + Math.sin(2 * Math.PI * 320 * t) * 0.5) * Math.exp(-t * 26);
    }

    const val = wave * vol;
    left[s] += val * 0.9;
    right[s] += val * 0.9;
  }
}

function renderAndMasterTrack(name, durationSec, renderFn) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  renderFn(left, right, numSamples, durationSec);

  // Peak normalization to -2dB (approx 0.80) to leave headroom
  let maxAmp = 0;
  for (let i = 0; i < numSamples; i++) {
    const al = Math.abs(left[i]);
    const ar = Math.abs(right[i]);
    if (al > maxAmp) maxAmp = al;
    if (ar > maxAmp) maxAmp = ar;
  }
  const gain = maxAmp > 0.001 ? Math.min(0.78 / maxAmp, 1.8) : 1.0;

  // Render raw PCM buffer
  const header = createWavHeader(numSamples, 2, SAMPLE_RATE);
  const pcm = Buffer.alloc(numSamples * 4);

  for (let i = 0; i < numSamples; i++) {
    let l = Math.tanh(left[i] * gain);
    let r = Math.tanh(right[i] * gain);

    // 0.08s smooth boundary crossfade for seamless looping
    const fadeSamples = Math.floor(SAMPLE_RATE * 0.08);
    if (i < fadeSamples) {
      const f = i / fadeSamples;
      l *= f;
      r *= f;
    } else if (i > numSamples - fadeSamples) {
      const f = (numSamples - i) / fadeSamples;
      l *= f;
      r *= f;
    }

    const valL = Math.max(-32767, Math.min(32767, Math.floor(l * 32767)));
    const valR = Math.max(-32767, Math.min(32767, Math.floor(r * 32767)));
    pcm.writeInt16LE(valL, i * 4);
    pcm.writeInt16LE(valR, i * 4 + 2);
  }

  const rawWavBuffer = Buffer.concat([header, pcm]);
  const tempWav = path.join('/tmp', `${name}_raw.wav`);
  fs.writeFileSync(tempWav, rawWavBuffer);

  const outMp3Public = path.join('public/assets/audio', `${name}.mp3`);
  const outAacPublic = path.join('public/assets/audio', `${name}.aac`);
  const outMp3Src = path.join('src/assets/audio', `${name}.mp3`);
  const outAacSrc = path.join('src/assets/audio', `${name}.aac`);

  // Master with FFmpeg Studio Chain:
  // - highpass 45Hz to eliminate sub-rumble
  // - lowpass 6200Hz to eliminate digital harshness (warm analog tape feel)
  // - warm bass boost at 110Hz (+1.8dB)
  // - gentle treble shelf (-1.2dB at 3800Hz)
  // - studio chorus/reverb for deep spatial richness
  // - smooth compand limiter to guarantee gentle, decent, non-irritating listening
  const masterFilter = [
    'highpass=f=45',
    'lowpass=f=6200',
    'bass=g=1.8:f=110',
    'treble=g=-1.2:f=3800',
    'chorus=0.6:0.8:35:0.35:0.22:1.6',
    'compand=0.03|0.06:0.1|0.1:-60/-60|-24/-24|-12/-12|0/-2.5:3:0:0:0.1'
  ].join(',');

  try {
    execSync(`ffmpeg -y -i "${tempWav}" -af "${masterFilter}" -b:a 192k "${outMp3Public}" 2>/dev/null`);
    execSync(`ffmpeg -y -i "${tempWav}" -af "${masterFilter}" -b:a 192k "${outAacPublic}" 2>/dev/null`);
    fs.copyFileSync(outMp3Public, outMp3Src);
    fs.copyFileSync(outAacPublic, outAacSrc);
    console.log(`✓ Mastered studio soundtrack: ${name}`);
  } catch (err) {
    console.error(`Error mastering ${name}:`, err.message);
  } finally {
    try { fs.unlinkSync(tempWav); } catch (_) {}
  }
}

// =====================================================================================
// COMPOSITION 1: BOLLYWOOD ROMANCE • "Fresh Blooms, Lasting Smiles"
// Inspired by soulful acoustic love ballads (Kesariya / Raag Yaman).
// Warm acoustic guitar arpeggios + emotive Bansuri flute melodic phrase.
// =====================================================================================
function composeBollywoodRomance(left, right, numSamples, durationSec) {
  // Acoustic Guitar Arpeggio in D Major (Warm, melodic, sweet)
  // Bar 1: D Major (D3 - A3 - F#4 - A4)
  addStudioNote(left, right, 'D2', 0.0, 1.8, 'acoustic_guitar', 0.28, -0.3);
  addStudioNote(left, right, 'D3', 0.1, 0.9, 'acoustic_guitar', 0.24, -0.2);
  addStudioNote(left, right, 'A3', 0.35, 0.9, 'acoustic_guitar', 0.22, -0.1);
  addStudioNote(left, right, 'F#4', 0.65, 0.9, 'acoustic_guitar', 0.26, 0.1);
  addStudioNote(left, right, 'A4', 0.95, 0.9, 'acoustic_guitar', 0.22, 0.2);
  addStudioNote(left, right, 'D4', 1.3, 0.7, 'acoustic_guitar', 0.20, 0.0);
  addStudioNote(left, right, 'F#4', 1.6, 0.5, 'acoustic_guitar', 0.18, 0.1);

  // Bar 2: G Major / B Minor resolution (B2 - D3 - G3 - B3 - D4)
  addStudioNote(left, right, 'G2', 2.0, 1.8, 'acoustic_guitar', 0.28, -0.3);
  addStudioNote(left, right, 'G3', 2.1, 0.9, 'acoustic_guitar', 0.24, -0.2);
  addStudioNote(left, right, 'B3', 2.35, 0.9, 'acoustic_guitar', 0.22, -0.1);
  addStudioNote(left, right, 'D4', 2.65, 0.9, 'acoustic_guitar', 0.26, 0.1);
  addStudioNote(left, right, 'G4', 2.95, 0.9, 'acoustic_guitar', 0.22, 0.2);
  addStudioNote(left, right, 'F#4', 3.3, 0.7, 'acoustic_guitar', 0.20, 0.1);
  addStudioNote(left, right, 'E4', 3.6, 0.5, 'acoustic_guitar', 0.18, 0.0);

  // Bansuri Flute Melodic Song Phrase (Singing emotional hook)
  // Phrase: D4 -> F#4 -> A4 (legato glide) -> B4 -> A4 -> F#4 -> E4 -> D4
  addStudioNote(left, right, 'D4', 0.2, 0.5, 'bansuri', 0.26, 0.15);
  addStudioNote(left, right, 'F#4', 0.7, 0.6, 'bansuri', 0.30, 0.15);
  addStudioNote(left, right, 'A4', 1.3, 0.8, 'bansuri', 0.34, 0.15);
  addStudioNote(left, right, 'B4', 2.1, 0.6, 'bansuri', 0.32, 0.15);
  addStudioNote(left, right, 'A4', 2.7, 0.5, 'bansuri', 0.28, 0.15);
  addStudioNote(left, right, 'F#4', 3.2, 0.45, 'bansuri', 0.26, 0.15);
  addStudioNote(left, right, 'D4', 3.65, 0.45, 'bansuri', 0.24, 0.15);

  // Soft Shakers & Ambient Foundation
  [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].forEach(t => addSoftPercussion(left, right, 'shaker', t, 0.10));
  addSoftPercussion(left, right, 'soft_kick', 0.0, 0.20);
  addSoftPercussion(left, right, 'finger_snap', 1.0, 0.14);
  addSoftPercussion(left, right, 'soft_kick', 2.0, 0.18);
  addSoftPercussion(left, right, 'finger_snap', 3.0, 0.14);
}

// =====================================================================================
// COMPOSITION 2: TRENDING REELS BEAT • "Build A Gift Basket With Me"
// Aesthetic Lo-Fi Chillhop with Rhodes piano chords, gentle vinyl snaps & mellow bass.
// =====================================================================================
function composeTrendingReelsBeat(left, right, numSamples, durationSec) {
  // Neo-Soul Rhodes Chord Progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
  // Bar 1 (0.0s - 2.0s): Fmaj7 & Em7
  addStudioNote(left, right, 'F2', 0.0, 1.0, 'warm_sub_bass', 0.32, -0.1);
  ['F3', 'A3', 'C4', 'E4'].forEach((n, idx) => {
    addStudioNote(left, right, n, 0.05 + idx * 0.03, 0.9, 'rhodes_piano', 0.22, (idx - 1.5) * 0.15);
  });

  addStudioNote(left, right, 'E2', 1.0, 1.0, 'warm_sub_bass', 0.30, -0.1);
  ['E3', 'G3', 'B3', 'D4'].forEach((n, idx) => {
    addStudioNote(left, right, n, 1.05 + idx * 0.03, 0.9, 'rhodes_piano', 0.22, (idx - 1.5) * 0.15);
  });

  // Bar 2 (2.0s - 4.0s): Dm7 & Cmaj7
  addStudioNote(left, right, 'D2', 2.0, 1.0, 'warm_sub_bass', 0.32, -0.1);
  ['D3', 'F3', 'A3', 'C4'].forEach((n, idx) => {
    addStudioNote(left, right, n, 2.05 + idx * 0.03, 0.9, 'rhodes_piano', 0.22, (idx - 1.5) * 0.15);
  });

  addStudioNote(left, right, 'C2', 3.0, 1.0, 'warm_sub_bass', 0.30, -0.1);
  ['C3', 'E3', 'G3', 'B3'].forEach((n, idx) => {
    addStudioNote(left, right, n, 3.05 + idx * 0.03, 0.9, 'rhodes_piano', 0.22, (idx - 1.5) * 0.15);
  });

  // Melodic Rhodes Lead Lick
  addStudioNote(left, right, 'A4', 0.6, 0.35, 'rhodes_piano', 0.20, 0.2);
  addStudioNote(left, right, 'G4', 1.6, 0.35, 'rhodes_piano', 0.20, 0.2);
  addStudioNote(left, right, 'E4', 2.6, 0.35, 'rhodes_piano', 0.22, 0.2);
  addStudioNote(left, right, 'D4', 3.5, 0.45, 'rhodes_piano', 0.20, 0.2);

  // Soft Lo-Fi Snaps & Beat
  addSoftPercussion(left, right, 'soft_kick', 0.0, 0.22);
  addSoftPercussion(left, right, 'finger_snap', 0.95, 0.18);
  addSoftPercussion(left, right, 'soft_kick', 1.7, 0.16);
  addSoftPercussion(left, right, 'soft_kick', 2.0, 0.22);
  addSoftPercussion(left, right, 'finger_snap', 2.95, 0.18);
  [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75].forEach(t => addSoftPercussion(left, right, 'shaker', t, 0.08));
}

// =====================================================================================
// COMPOSITION 3: TURKISH CINEMATIC STRINGS • "Midnight Anniversary Surprise"
// Deep emotional Mediterranean strings, cello foundation & romantic Turkish Oud plucks.
// =====================================================================================
function composeTurkishCinematicStrings(left, right, numSamples, durationSec) {
  // Deep Orchestral Cello Foundation in A Minor / D Minor
  addStudioNote(left, right, 'A2', 0.0, 2.0, 'strings_ensemble', 0.30, -0.3);
  addStudioNote(left, right, 'C3', 0.0, 2.0, 'strings_ensemble', 0.24, -0.1);
  addStudioNote(left, right, 'E3', 0.0, 2.0, 'strings_ensemble', 0.24, 0.1);

  addStudioNote(left, right, 'D2', 2.0, 2.0, 'strings_ensemble', 0.30, -0.3);
  addStudioNote(left, right, 'F3', 2.0, 2.0, 'strings_ensemble', 0.24, -0.1);
  addStudioNote(left, right, 'A3', 2.0, 2.0, 'strings_ensemble', 0.24, 0.1);

  // Turkish Oud Plucked Melodic Motif (Exotic & Heartfelt)
  addStudioNote(left, right, 'A3', 0.1, 0.6, 'oud', 0.28, 0.25);
  addStudioNote(left, right, 'B3', 0.45, 0.5, 'oud', 0.26, 0.25);
  addStudioNote(left, right, 'C4', 0.8, 0.7, 'oud', 0.30, 0.25);
  addStudioNote(left, right, 'D4', 1.4, 0.6, 'oud', 0.28, 0.25);
  addStudioNote(left, right, 'E4', 1.85, 0.7, 'oud', 0.32, 0.25);
  addStudioNote(left, right, 'F4', 2.45, 0.6, 'oud', 0.30, 0.25);
  addStudioNote(left, right, 'E4', 2.95, 0.5, 'oud', 0.28, 0.25);
  addStudioNote(left, right, 'D4', 3.35, 0.45, 'oud', 0.26, 0.25);
  addStudioNote(left, right, 'A3', 3.7, 0.4, 'oud', 0.24, 0.25);

  // Soft Frame Drum Pulsing
  addSoftPercussion(left, right, 'soft_kick', 0.0, 0.22);
  addSoftPercussion(left, right, 'shaker', 0.6, 0.10);
  addSoftPercussion(left, right, 'soft_kick', 1.2, 0.16);
  addSoftPercussion(left, right, 'soft_kick', 2.0, 0.22);
  addSoftPercussion(left, right, 'shaker', 2.6, 0.10);
  addSoftPercussion(left, right, 'soft_kick', 3.2, 0.16);
}

// =====================================================================================
// COMPOSITION 4: HOLLYWOOD LUXURY LOUNGE • "Gentleman’s Watch & Fragrance Box"
// Deep suave velvet bass, sophisticated boutique chords & sleek velvet rimshot.
// =====================================================================================
function composeHollywoodLuxuryLounge(left, right, numSamples, durationSec) {
  // Deep walking luxury sub bass
  addStudioNote(left, right, 'Eb2', 0.0, 0.9, 'warm_sub_bass', 0.34, 0.0);
  addStudioNote(left, right, 'Bb2', 1.0, 0.9, 'warm_sub_bass', 0.32, 0.0);
  addStudioNote(left, right, 'Ab2', 2.0, 0.9, 'warm_sub_bass', 0.34, 0.0);
  addStudioNote(left, right, 'Db2', 3.0, 0.9, 'warm_sub_bass', 0.32, 0.0);

  // Sophisticated Prestige Rhodes Chords
  ['Eb3', 'G3', 'Bb3', 'Db4', 'F4'].forEach((n, idx) => {
    addStudioNote(left, right, n, 0.1 + idx * 0.02, 1.2, 'rhodes_piano', 0.18, (idx - 2) * 0.12);
  });
  ['Ab3', 'C4', 'Eb4', 'Gb4'].forEach((n, idx) => {
    addStudioNote(left, right, n, 2.1 + idx * 0.02, 1.2, 'rhodes_piano', 0.18, (idx - 1.5) * 0.12);
  });

  // Velvet Chime Lick
  addStudioNote(left, right, 'Bb4', 0.8, 0.4, 'music_box_bell', 0.14, 0.3);
  addStudioNote(left, right, 'C5', 1.4, 0.4, 'music_box_bell', 0.14, 0.3);
  addStudioNote(left, right, 'Db5', 2.8, 0.4, 'music_box_bell', 0.14, 0.3);
  addStudioNote(left, right, 'F5', 3.4, 0.45, 'music_box_bell', 0.12, 0.3);

  // Suave Velvet Rimshot & Kick Groove
  addSoftPercussion(left, right, 'soft_kick', 0.0, 0.24);
  addSoftPercussion(left, right, 'velvet_rimshot', 1.0, 0.20);
  addSoftPercussion(left, right, 'soft_kick', 1.8, 0.16);
  addSoftPercussion(left, right, 'soft_kick', 2.0, 0.22);
  addSoftPercussion(left, right, 'velvet_rimshot', 3.0, 0.20);
}

// =====================================================================================
// COMPOSITION 5: AESTHETIC ASMR MUSIC BOX • "Custom Magnetic Packaging & Ribbon"
// Celestial music box bells, delicate soft satin unboxing ambiance & soothing peace.
// =====================================================================================
function composeAestheticAsmrUnboxing(left, right, numSamples, durationSec) {
  // Gentle Satin Velvet Ambient Pad
  addStudioNote(left, right, 'E3', 0.0, 2.0, 'strings_ensemble', 0.18, -0.2);
  addStudioNote(left, right, 'B3', 0.0, 2.0, 'strings_ensemble', 0.16, 0.2);
  addStudioNote(left, right, 'A3', 2.0, 2.0, 'strings_ensemble', 0.18, -0.2);
  addStudioNote(left, right, 'E4', 2.0, 2.0, 'strings_ensemble', 0.16, 0.2);

  // Delicate Celestial Music Box Chimes (Anti-stress, satisfying unboxing)
  const bellMelody = [
    { note: 'E5', time: 0.1 },
    { note: 'G#5', time: 0.5 },
    { note: 'B5', time: 0.9 },
    { note: 'E6', time: 1.4 },
    { note: 'D#5', time: 1.85 },
    { note: 'B5', time: 2.2 },
    { note: 'C#5', time: 2.65 },
    { note: 'G#5', time: 3.1 },
    { note: 'E5', time: 3.55 },
  ];

  bellMelody.forEach(b => {
    addStudioNote(left, right, b.note, b.time, 0.65, 'music_box_bell', 0.20, (Math.random() - 0.5) * 0.4);
  });
}

// =====================================================================================
// COMPOSITION 6: BOUTIQUE ACOUSTIC SHIMMER • "Permanent Bracelets & Boutique Jewelry"
// Delicate sparkling acoustic harp & guitar shimmer with romantic pop sparkle.
// =====================================================================================
function composeBoutiqueAcousticShimmer(left, right, numSamples, durationSec) {
  // Acoustic Guitar / Harp Arpeggios in G Major
  addStudioNote(left, right, 'G2', 0.0, 1.8, 'harp', 0.26, -0.25);
  addStudioNote(left, right, 'G3', 0.1, 0.8, 'harp', 0.22, -0.15);
  addStudioNote(left, right, 'B3', 0.35, 0.8, 'harp', 0.22, 0.0);
  addStudioNote(left, right, 'D4', 0.65, 0.8, 'harp', 0.24, 0.15);
  addStudioNote(left, right, 'G4', 0.95, 0.8, 'harp', 0.26, 0.25);
  addStudioNote(left, right, 'B4', 1.3, 0.7, 'harp', 0.22, 0.1);

  addStudioNote(left, right, 'E2', 2.0, 1.8, 'harp', 0.26, -0.25);
  addStudioNote(left, right, 'E3', 2.1, 0.8, 'harp', 0.22, -0.15);
  addStudioNote(left, right, 'G3', 2.35, 0.8, 'harp', 0.22, 0.0);
  addStudioNote(left, right, 'B3', 2.65, 0.8, 'harp', 0.24, 0.15);
  addStudioNote(left, right, 'E4', 2.95, 0.8, 'harp', 0.26, 0.25);
  addStudioNote(left, right, 'G4', 3.3, 0.7, 'harp', 0.22, 0.1);

  // Sparkling Bell Accents
  addStudioNote(left, right, 'D5', 0.7, 0.5, 'music_box_bell', 0.15, 0.3);
  addStudioNote(left, right, 'G5', 1.5, 0.5, 'music_box_bell', 0.15, 0.3);
  addStudioNote(left, right, 'F#5', 2.7, 0.5, 'music_box_bell', 0.15, 0.3);
  addStudioNote(left, right, 'E5', 3.5, 0.5, 'music_box_bell', 0.15, 0.3);

  // Gentle shaker
  [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].forEach(t => addSoftPercussion(left, right, 'shaker', t, 0.09));
  addSoftPercussion(left, right, 'soft_kick', 0.0, 0.18);
  addSoftPercussion(left, right, 'finger_snap', 1.0, 0.14);
  addSoftPercussion(left, right, 'soft_kick', 2.0, 0.18);
  addSoftPercussion(left, right, 'finger_snap', 3.0, 0.14);
}

// =====================================================================================
// MASTER EXECUTION
// =====================================================================================
console.log('--- Generating Studio-Quality Harmonic Soundtracks ---');

renderAndMasterTrack('bollywood_romance', 4.0, composeBollywoodRomance);
renderAndMasterTrack('trending_reels_beat', 4.0, composeTrendingReelsBeat);
renderAndMasterTrack('turkish_cinematic_strings', 4.0, composeTurkishCinematicStrings);
renderAndMasterTrack('hollywood_luxury_lounge', 4.0, composeHollywoodLuxuryLounge);
renderAndMasterTrack('aesthetic_asmr_unboxing', 4.0, composeAestheticAsmrUnboxing);
renderAndMasterTrack('boutique_acoustic_shimmer', 4.0, composeBoutiqueAcousticShimmer);

console.log('--- Muxing Audio into Public & Source Video Files ---');

// Video to audio mapping
const VIDEO_SOUND_MAP = [
  { video: 'film_flower_bouquet.mp4', audio: 'bollywood_romance.mp3' },
  { video: 'reel_flower_bouquet.mp4', audio: 'bollywood_romance.mp3' },
  { video: 'film_custom_basket.mp4', audio: 'trending_reels_beat.mp3' },
  { video: 'reel_custom_basket.mp4', audio: 'trending_reels_beat.mp3' },
  { video: 'film_anniversary_romance.mp4', audio: 'turkish_cinematic_strings.mp3' },
  { video: 'reel_anniversary.mp4', audio: 'turkish_cinematic_strings.mp3' },
  { video: 'reel_watch_perfume.mp4', audio: 'hollywood_luxury_lounge.mp3' },
  { video: 'reel_bracelets.mp4', audio: 'boutique_acoustic_shimmer.mp3' },
  { video: 'reel_packaging.mp4', audio: 'aesthetic_asmr_unboxing.mp3' },
];

for (const item of VIDEO_SOUND_MAP) {
  const videoPub = path.join('public/assets/videos', item.video);
  const audioPub = path.join('public/assets/audio', item.audio);
  const tempOut = path.join('/tmp', `mux_${item.video}`);

  if (fs.existsSync(videoPub) && fs.existsSync(audioPub)) {
    try {
      execSync(`ffmpeg -y -i "${videoPub}" -i "${audioPub}" -c:v copy -c:a aac -b:a 192k -shortest "${tempOut}" 2>/dev/null`);
      fs.copyFileSync(tempOut, videoPub);
      fs.copyFileSync(tempOut, path.join('src/assets/videos', item.video));
      console.log(`✓ Muxed audio into ${item.video}`);
    } catch (e) {
      console.error(`Failed muxing ${item.video}:`, e.message);
    } finally {
      try { fs.unlinkSync(tempOut); } catch (_) {}
    }
  }
}

console.log('--- Sound Synthesis & Video Muxing Complete ---');
