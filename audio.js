/* =====================================================================
   SOUND SYSTEM - Mystical / Sufi-inspired sound design
   All sounds synthesised with the Web Audio API (no external files)

   Design philosophy:
     - Warm, detuned oscillators (chorus effect) for richness
     - Filtered + reverbed signals for organic, ney/oud-like timbres
     - Hijaz-influenced intervals (Eastern modal flavor)
     - Bell-like inharmonic tones for "wisdom" cues
     - Long, breathy decays - no harsh attacks
   ===================================================================== */

let audioCtx = null;
let masterGain = null;
let convolver = null;
let thinkingNodes = null;

function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.85;
    masterGain.connect(audioCtx.destination);
    convolver = audioCtx.createConvolver();
    convolver.buffer = makeReverbImpulse(2.4, 2.0);
    const wet = audioCtx.createGain();
    wet.gain.value = 0.28;
    convolver.connect(wet);
    wet.connect(masterGain);
  } catch (e) {
    audioCtx = null;
  }
}

function makeReverbImpulse(seconds, decay) {
  const rate = audioCtx.sampleRate;
  const length = rate * seconds;
  const impulse = audioCtx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

/**
 * Warm, detuned tone with chorus + lowpass + reverb send.
 */
function playTone(freq, duration, type = 'sine', volume = 0.2, when = 0, opts = {}) {
  if (!audioCtx || !game.soundOn) return null;
  const t = audioCtx.currentTime + when;
  const detune = opts.detune != null ? opts.detune : 7;
  const attack = opts.attack != null ? opts.attack : 0.04;
  const release = opts.release != null ? opts.release : duration;
  const cutoff = opts.cutoff != null ? opts.cutoff : 2400;
  const reverb = opts.reverb != null ? opts.reverb : 0.5;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc1.type = type;
  osc2.type = type;
  osc1.frequency.setValueAtTime(freq, t);
  osc2.frequency.setValueAtTime(freq, t);
  osc1.detune.setValueAtTime(-detune, t);
  osc2.detune.setValueAtTime(detune, t);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, t);
  filter.Q.value = 0.7;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0008, t + duration + release);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  if (convolver && reverb > 0) {
    const send = audioCtx.createGain();
    send.gain.value = reverb * 0.6;
    gain.connect(send);
    send.connect(convolver);
  }

  const stopAt = t + duration + release + 0.1;
  osc1.start(t); osc2.start(t);
  osc1.stop(stopAt); osc2.stop(stopAt);
  return { osc1, osc2, gain, filter };
}

/**
 * Bell / singing-bowl tone via inharmonic additive synthesis.
 * Used for "moments of clarity" - lifeline, correct, win.
 */
function playBell(freq, duration, volume = 0.18, when = 0) {
  if (!audioCtx || !game.soundOn) return;
  const t = audioCtx.currentTime + when;
  const partials = [1, 2.01, 3.02, 4.51, 5.43];
  const weights  = [1.0, 0.55, 0.32, 0.18, 0.10];

  partials.forEach((ratio, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * ratio, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume * weights[i], t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0005, t + duration);
    osc.connect(g);
    g.connect(masterGain);
    if (convolver) {
      const send = audioCtx.createGain();
      send.gain.value = 0.4 * weights[i];
      g.connect(send);
      send.connect(convolver);
    }
    osc.start(t);
    osc.stop(t + duration + 0.05);
  });
}

/**
 * Ney-like flute tone - breathy lowpassed triangle with a touch of noise.
 */
function playNey(freq, duration, volume = 0.22, when = 0) {
  if (!audioCtx || !game.soundOn) return;
  const t = audioCtx.currentTime + when;

  const noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * (duration + 0.2), audioCtx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuf;

  const noiseGain = audioCtx.createGain();
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = freq * 1.5;
  noiseFilter.Q.value = 4;
  noiseGain.gain.setValueAtTime(0, t);
  noiseGain.gain.linearRampToValueAtTime(volume * 0.18, t + 0.08);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc2.type = 'sine';
  osc.frequency.value = freq;
  osc2.frequency.value = freq;
  osc.detune.value = -5;
  osc2.detune.value = 5;

  filter.type = 'lowpass';
  filter.frequency.value = freq * 4;
  filter.Q.value = 1;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0008, t + duration);

  osc.connect(filter); osc2.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  if (convolver) {
    const send = audioCtx.createGain();
    send.gain.value = 0.5;
    gain.connect(send);
    send.connect(convolver);
  }

  osc.start(t); osc2.start(t); noise.start(t);
  const stopAt = t + duration + 0.15;
  osc.stop(stopAt); osc2.stop(stopAt); noise.stop(stopAt);
}

/* =====================================================================
   SOUND EVENTS - mapped to game moments
   ===================================================================== */

function playSound(type) {
  if (!audioCtx || !game.soundOn) return;
  switch (type) {
    case 'start':
      // Ascending Hijaz-flavoured opening - call to attention
      playBell(261.63, 1.6, 0.20, 0);
      playNey(392.00, 1.4, 0.18, 0.25);
      playNey(523.25, 1.6, 0.18, 0.55);
      playBell(659.25, 2.0, 0.15, 0.85);
      break;

    case 'next':
      // Soft chime - turning the page
      playBell(523.25, 0.9, 0.12, 0);
      playBell(783.99, 1.0, 0.10, 0.06);
      break;

    case 'select':
      // Quiet meditation tap - finger on a singing bowl rim
      playBell(880, 0.5, 0.10, 0);
      break;

    case 'lock':
      // Deep, resolute drone - the answer is committed
      playTone(110, 1.0, 'triangle', 0.22, 0, { cutoff: 800, release: 0.6 });
      playTone(82.41, 1.2, 'sine', 0.18, 0, { cutoff: 600, detune: 12 });
      playNey(440, 0.6, 0.15, 0.05);
      break;

    case 'thinking':
      startThinking();
      break;

    case 'correct':
      // Hijaz tetrachord ascent resolving on a bell
      playNey(293.66, 0.55, 0.18, 0);
      playNey(311.13, 0.55, 0.18, 0.18);
      playNey(369.99, 0.55, 0.20, 0.36);
      playNey(392.00, 0.7, 0.22, 0.54);
      playBell(587.33, 2.4, 0.20, 0.74);
      playBell(880.00, 2.4, 0.13, 0.78);
      break;

    case 'wrong':
      // Descending lament - chromatic sigh + drone
      playNey(330, 0.5, 0.18, 0);
      playNey(311.13, 0.6, 0.18, 0.25);
      playTone(146.83, 1.4, 'sawtooth', 0.16, 0.40, { cutoff: 500, detune: 15, release: 0.8 });
      playTone(98, 1.6, 'sine', 0.20, 0.50, { cutoff: 400, detune: 20 });
      break;

    case 'lifeline':
      // Singing bowl + ney puff - help arriving
      playBell(659.25, 1.4, 0.18, 0);
      playNey(987.77, 0.5, 0.14, 0.10);
      playBell(1318.51, 1.6, 0.10, 0.25);
      break;

    case 'walkaway':
      // Wise, contemplative - rising bells then long ney
      playBell(440, 1.4, 0.16, 0);
      playBell(554.37, 1.4, 0.16, 0.30);
      playBell(659.25, 1.6, 0.16, 0.60);
      playNey(880, 2.5, 0.17, 0.85);
      break;

    case 'gameover':
      // Slow descent - dignified, not slapstick sad
      playNey(220, 1.0, 0.20, 0);
      playNey(196, 1.2, 0.20, 0.50);
      playTone(110, 2.4, 'triangle', 0.22, 0.80, { cutoff: 600, detune: 18, release: 1.4 });
      playTone(73.42, 2.6, 'sine', 0.20, 0.90, { cutoff: 400, detune: 20 });
      playBell(440, 3.0, 0.10, 1.30);
      break;

    case 'win':
      // Ecstatic Sufi ascent - birds reaching the Simorgh
      const winNotes = [261.63, 311.13, 369.99, 392.00, 466.16, 523.25, 622.25, 783.99];
      winNotes.forEach((f, i) => playNey(f, 0.5, 0.18, i * 0.18));
      playBell(523.25, 3.5, 0.20, 1.6);
      playBell(659.25, 3.5, 0.20, 1.8);
      playBell(783.99, 3.8, 0.18, 2.0);
      playBell(1046.50, 4.0, 0.16, 2.3);
      playBell(1318.51, 4.0, 0.12, 2.6);
      playTone(130.81, 4.0, 'triangle', 0.16, 1.6, { cutoff: 600, detune: 15, release: 1.0 });
      break;
  }
}

/* =====================================================================
   "THINKING" DRONE - tanpura/zikir-like pulsing fifth interval
   ===================================================================== */
function startThinking() {
  if (!audioCtx || !game.soundOn || thinkingNodes) return;
  const t = audioCtx.currentTime;

  const root = 73.42;          // D2 - deep, calm
  const fifth = 110;           // A2

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const osc3 = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();

  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc3.type = 'triangle';
  osc1.frequency.value = root;
  osc2.frequency.value = root;
  osc3.frequency.value = fifth;
  osc1.detune.value = -8;
  osc2.detune.value = 10;
  osc3.detune.value = 4;

  filter.type = 'lowpass';
  filter.frequency.value = 700;
  filter.Q.value = 1.2;

  lfo.frequency.value = 0.6;
  lfoGain.gain.value = 0.04;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.13, t + 0.5);

  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  if (convolver) {
    const send = audioCtx.createGain();
    send.gain.value = 0.4;
    gain.connect(send);
    send.connect(convolver);
  }

  osc1.start(t);
  osc2.start(t);
  osc3.start(t);
  lfo.start(t);

  thinkingNodes = { osc1, osc2, osc3, lfo, gain };
}

function stopThinking() {
  if (!thinkingNodes || !audioCtx) return;
  const t = audioCtx.currentTime;
  thinkingNodes.gain.gain.cancelScheduledValues(t);
  thinkingNodes.gain.gain.setValueAtTime(thinkingNodes.gain.gain.value, t);
  thinkingNodes.gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.4);
  const stopAt = t + 0.5;
  thinkingNodes.osc1.stop(stopAt);
  thinkingNodes.osc2.stop(stopAt);
  thinkingNodes.osc3.stop(stopAt);
  thinkingNodes.lfo.stop(stopAt);
  thinkingNodes = null;
}
