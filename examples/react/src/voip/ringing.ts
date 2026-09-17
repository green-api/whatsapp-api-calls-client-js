/**
 * The two sounds a phone makes before a call connects.
 *
 * Synthesised rather than played from files: the tones are two sine waves and a cadence,
 * which is less code than an audio asset would be markup, and it keeps the example free of
 * binaries whose licence a reader would have to check before copying anything.
 */
interface Tone {
  /** Partials sounded together — real ring tones are a pair, which is what makes them ring. */
  frequencies: number[];
  /** Alternating seconds of tone and silence, repeated for as long as it rings. */
  cadence: number[];
  /** Peak gain. Quiet on purpose: this plays while someone is holding a phone to their ear. */
  volume: number;
}

/** What the caller hears while the far end is ringing: one tone, on briefly, off for long. */
const RINGBACK: Tone = { frequencies: [425], cadence: [1, 4], volume: 0.1 };

/** What the callee hears. Two short bursts and a pause — the cadence that reads as "answer me". */
const RINGTONE: Tone = { frequencies: [440, 480], cadence: [0.4, 0.2, 0.4, 2], volume: 0.12 };

let context: AudioContext | null = null;
let stopCurrent: (() => void) | null = null;

/**
 * The shared audio context, created on first use and kept for the life of the page.
 *
 * Browsers start it suspended until the page has been interacted with, and refuse to resume
 * it otherwise. That is left to fail quietly: an incoming call can arrive at a page nobody
 * has touched yet, and a silent ring is a far smaller problem than a thrown error on the
 * path that also shows the accept button.
 */
function audioContext(): AudioContext | null {
  if (context) {
    return context;
  }

  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!Ctor) {
    return null;
  }

  try {
    context = new Ctor();
  } catch {
    return null;
  }

  return context;
}

/** Starts a tone and returns the stop. Only one rings at a time. */
function ring(tone: Tone): () => void {
  stopCurrent?.();

  const ctx = audioContext();

  if (!ctx) {
    return () => {};
  }

  void ctx.resume().catch(() => {});

  const gain = ctx.createGain();

  gain.gain.value = 0;
  gain.connect(ctx.destination);

  const oscillators = tone.frequencies.map((frequency) => {
    const oscillator = ctx.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start();

    return oscillator;
  });

  // Split between the partials so a two-tone ring is no louder than a one-tone one.
  const peak = tone.volume / oscillators.length;
  const cycle = tone.cadence.reduce((total, duration) => total + duration, 0);

  /**
   * Lays one full cadence onto the audio clock.
   *
   * Two events per segment, not one. A ramp interpolates from the previous event, so ramps
   * alone would spend the whole segment sliding between levels — a slow wobble that is never
   * silent rather than a ring. The second event pins the level for the rest of the segment,
   * and the short ramp into it is what keeps the edges from clicking.
   */
  const schedule = (from: number) => {
    let at = from;

    tone.cadence.forEach((duration, index) => {
      const level = index % 2 === 0 ? peak : 0;

      gain.gain.linearRampToValueAtTime(level, at + 0.02);
      gain.gain.setValueAtTime(level, at + duration);
      at += duration;
    });
  };

  const start = ctx.currentTime + 0.05;
  let next = start + cycle;

  schedule(start);

  const timer = window.setInterval(() => {
    schedule(next);
    next += cycle;
  }, cycle * 1000);

  const stop = () => {
    window.clearInterval(timer);

    const now = ctx.currentTime;

    // Fade instead of cut, and only then tear down: stopping an oscillator mid-tone is a
    // click of its own, and this often runs exactly as the call audio starts.
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.06);
    oscillators.forEach((oscillator) => oscillator.stop(now + 0.1));
    window.setTimeout(() => gain.disconnect(), 200);

    if (stopCurrent === stop) {
      stopCurrent = null;
    }
  };

  stopCurrent = stop;

  return stop;
}

/** Rings for the caller, while the far end has not picked up. */
export const startRingback = (): (() => void) => ring(RINGBACK);

/** Rings for the callee, while the call is waiting to be answered. */
export const startRingtone = (): (() => void) => ring(RINGTONE);
