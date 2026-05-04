/* =====================================================================
   SOUND SYSTEM - Eastern / Islamic Mystical Sound Design
   All sounds synthesised with the Web Audio API
   Inspired by makam music, oud tones, and Sufi atmosphere
   (no external audio files needed)
   ===================================================================== */

let audioCtx = null;
let thinkingNodes = null;

function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    audioCtx = null;
  }
}

function playTone(freq, duration, type = 'sine', volume = 0.2, when = 0, vibrato = false) {
  if (!audioCtx || !game.soundOn) return null;
  const t = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (vibrato) {
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = freq * 0.008;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + duration + 0.05);
  }
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
  return { osc, gain };
}

function playPluck(freq, duration, volume = 0.15, when = 0) {
  if (!audioCtx || !game.soundOn) return;
  const t = audioCtx.currentTime + when;
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq, t);
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 1.002, t);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 6, t);
  filter.frequency.exponentialRampToValueAtTime(freq * 1.5, t + duration * 0.6);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + duration + 0.05);
  osc2.stop(t + duration + 0.05);
}

function playSound(type) {
  if (!audioCtx || !game.soundOn) return;
  switch (type) {
    case 'start':
      playPluck(220, 0.4, 0.16, 0);
      playPluck(261.6, 0.35, 0.16, 0.25);
      playPluck(277.2, 0.35, 0.18, 0.5);
      playPluck(329.6, 0.35, 0.16, 0.75);
      playPluck(440, 0.8, 0.2, 1.0);
      playTone(110, 2.0, 'sine', 0.06, 0, true);
      playTone(165, 2.0, 'sine', 0.04, 0);
      break;
    case 'next':
      playPluck(330, 0.2, 0.1, 0);
      playPluck(440, 0.25, 0.1, 0.08);
      break;
    case 'select':
      playPluck(660, 0.08, 0.07, 0);
      break;
    case 'lock':
      playTone(73.4, 0.8, 'sawtooth', 0.12, 0);
      playTone(110, 0.7, 'sine', 0.1, 0, true);
      playPluck(146.8, 0.3, 0.08, 0.1);
      break;
    case 'thinking':
      startThinking();
      break;
    case 'correct':
      playPluck(220, 0.2, 0.15, 0);
      playPluck(277.2, 0.2, 0.15, 0.15);
      playPluck(329.6, 0.2, 0.15, 0.30);
      playPluck(440, 0.2, 0.18, 0.45);
      playPluck(554.4, 0.2, 0.18, 0.60);
      playPluck(660, 0.6, 0.2, 0.75);
      playTone(440, 1.5, 'sine', 0.05, 0.5, true);
      playTone(660, 1.5, 'sine', 0.04, 0.5, true);
      break;
    case 'wrong':
      playPluck(330, 0.35, 0.16, 0);
      playPluck(293.7, 0.35, 0.16, 0.25);
      playPluck(261.6, 0.4, 0.16, 0.5);
      playTone(110, 1.2, 'sawtooth', 0.1, 0.3);
      playTone(82.4, 1.5, 'sine', 0.08, 0.5);
      break;
    case 'lifeline':
      playPluck(440, 0.1, 0.1, 0);
      playPluck(554.4, 0.1, 0.1, 0.06);
      playPluck(660, 0.15, 0.12, 0.12);
      break;
    case 'walkaway':
      playPluck(440, 0.3, 0.14, 0);
      playPluck(329.6, 0.3, 0.14, 0.2);
      playPluck(220, 0.6, 0.16, 0.4);
      playTone(110, 1.5, 'sine', 0.06, 0.3, true);
      break;
    case 'gameover':
      playPluck(293.7, 0.4, 0.14, 0);
      playPluck(261.6, 0.4, 0.14, 0.3);
      playPluck(220, 0.5, 0.14, 0.6);
      playTone(110, 1.8, 'sawtooth', 0.08, 0.4);
      playTone(55, 2.0, 'sine', 0.06, 0.6);
      break;
    case 'win':
      [0, 0.18, 0.36, 0.54, 0.72, 0.9].forEach((delay, i) => {
        const notes = [220, 277.2, 329.6, 440, 554.4, 660];
        playPluck(notes[i], 0.22, 0.18, delay);
      });
      playPluck(880, 0.8, 0.22, 1.1);
      playTone(440, 2.5, 'sine', 0.06, 1.0, true);
      playTone(660, 2.5, 'sine', 0.05, 1.0, true);
      playTone(880, 2.5, 'sine', 0.04, 1.0, true);
      break;
  }
}

function startThinking() {
  if (!audioCtx || !game.soundOn || thinkingNodes) return;
  const t = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 110;
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 165.5;
  const osc3 = audioCtx.createOscillator();
  osc3.type = 'triangle';
  osc3.frequency.value = 143;
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.value = 0.8;
  lfoGain.gain.value = 0.03;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.09, t + 0.5);
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  osc1.connect(gain);
  osc2.connect(gain);
  osc3.connect(gain);
  gain.connect(audioCtx.destination);
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
  thinkingNodes.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  thinkingNodes.osc1.stop(t + 0.35);
  thinkingNodes.osc2.stop(t + 0.35);
  thinkingNodes.osc3.stop(t + 0.35);
  thinkingNodes.lfo.stop(t + 0.35);
  thinkingNodes = null;
}
