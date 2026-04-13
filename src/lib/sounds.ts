const ctx = () => {
  if (!(window as any).__audioCtx) {
    (window as any).__audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__audioCtx as AudioContext;
};

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const c = ctx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playKeyPress() {
  playTone(800, 0.06, 'square', 0.05);
}

export function playBackspace() {
  playTone(400, 0.08, 'square', 0.04);
}

export function playSubmit() {
  playTone(600, 0.12, 'triangle', 0.1);
}

export function playCorrectReveal() {
  playTone(880, 0.2, 'sine', 0.12);
}

export function playPresentReveal() {
  playTone(660, 0.15, 'sine', 0.08);
}

export function playAbsentReveal() {
  playTone(220, 0.15, 'triangle', 0.06);
}

export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.15), i * 120);
  });
}

export function playLoss() {
  const notes = [440, 370, 311, 261];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.4, 'sawtooth', 0.08), i * 200);
  });
}

export function playError() {
  playTone(200, 0.15, 'sawtooth', 0.08);
  setTimeout(() => playTone(180, 0.15, 'sawtooth', 0.08), 100);
}

export function playHint() {
  playTone(1200, 0.15, 'sine', 0.1);
  setTimeout(() => playTone(1400, 0.1, 'sine', 0.1), 100);
}
