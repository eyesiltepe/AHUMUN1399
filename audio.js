/* =====================================================================
   SOUND SYSTEM - All sounds synthesised with the Web Audio API
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

function playTone(freq, duration, type = 'sine', volume = 0.2, when = 0) {
  if (!audioCtx || !game.soundOn) return null;
  const t = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
  return { osc, gain };
}

function playSound(type) {
  if (!audioCtx || !game.soundOn) return;
  switch (type) {
    case 'start':
      playTone(523.25, 0.18, 'triangle', 0.18, 0);
      playTone(659.25, 0.18, 'triangle', 0.18, 0.18);
      playTone(783.99, 0.4, 'triangle', 0.22, 0.36);
      break;
    case 'next':
      playTone(440, 0.08, 'sine', 0.12, 0);
      playTone(660, 0.12, 'sine', 0.12, 0.05);
      break;
    case 'select':
      playTone(800, 0.06, 'square', 0.08, 0);
      break;
    case 'lock':
      playTone(110, 0.5, 'sawtooth', 0.18, 0);
      playTone(82.5, 0.6, 'sine', 0.15, 0);
      break;
    case 'thinking':
      startThinking();
      break;
    case 'correct':
      playTone(523.25, 0.15, 'triangle', 0.18, 0);
      playTone(659.25, 0.15, 'triangle', 0.18, 0.15);
      playTone(783.99, 0.15, 'triangle', 0.18, 0.30);
      playTone(1046.5, 0.4, 'triangle', 0.22, 0.45);
      break;
    case 'wrong':
      playTone(220, 0.25, 'sawtooth', 0.18, 0);
      playTone(165, 0.35, 'sawtooth', 0.18, 0.18);
      playTone(110, 0.6, 'sawtooth', 0.18, 0.4);
      break;
    case 'lifeline':
      playTone(660, 0.08, 'sine', 0.12, 0);
      playTone(880, 0.08, 'sine', 0.12, 0.05);
      playTone(1100, 0.12, 'sine', 0.12, 0.1);
      break;
    case 'walkaway':
      playTone(880, 0.1, 'triangle', 0.18, 0);
      playTone(1175, 0.15, 'triangle', 0.18, 0.1);
      playTone(1568, 0.3, 'triangle', 0.18, 0.2);
      break;
    case 'gameover':
      playTone(330, 0.3, 'sawtooth', 0.16, 0);
      playTone(247, 0.3, 'sawtooth', 0.16, 0.25);
      playTone(165, 0.6, 'sawtooth', 0.18, 0.5);
      break;
    case 'win':
      [0, 0.18, 0.36, 0.54, 0.72].forEach((delay, i) => {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        playTone(notes[i], 0.18, 'triangle', 0.2, delay);
      });
      playTone(1568, 1.2, 'triangle', 0.25, 0.9);
      playTone(2093, 1.2, 'triangle', 0.18, 0.9);
      break;
  }
}

function startThinking() {
  if (!audioCtx || !game.soundOn || thinkingNodes) return;
  const t = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();

  osc1.type = 'sawtooth';
  osc1.frequency.value = 55;
  osc2.type = 'sine';
  osc2.frequency.value = 82.5;
  lfo.frequency.value = 4;
  lfoGain.gain.value = 0.05;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.2);

  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  osc1.start(t);
  osc2.start(t);
  lfo.start(t);

  thinkingNodes = { osc1, osc2, lfo, gain };
}

function stopThinking() {
  if (!thinkingNodes || !audioCtx) return;
  const t = audioCtx.currentTime;
  thinkingNodes.gain.gain.cancelScheduledValues(t);
  thinkingNodes.gain.gain.setValueAtTime(thinkingNodes.gain.gain.value, t);
  thinkingNodes.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  thinkingNodes.osc1.stop(t + 0.2);
  thinkingNodes.osc2.stop(t + 0.2);
  thinkingNodes.lfo.stop(t + 0.2);
  thinkingNodes = null;
}
