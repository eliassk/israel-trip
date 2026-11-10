import { load, save } from './storage'

// Effects are synthesized with Web Audio, so there are no files to download.
// Browsers only allow audio after a tap; `unlock` MUST be called from a tap handler.

let ctx: AudioContext | null = null
let muted = load('muted', false)

export const isMuted = () => muted
export function setMuted(value: boolean) {
  muted = value
  save('muted', value)
}

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (AC) ctx = new AC()
  }
  if (ctx?.state === 'suspended') void ctx.resume()
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; to?: number; delay?: number } = {}) {
  if (muted || !ctx) return
  const t = ctx.currentTime + (opts.delay ?? 0)
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, t)
  if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t + dur)
  gain.gain.setValueAtTime(opts.vol ?? 0.18, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + dur)
}

export const sound = {
  /** Pitch climbs with the combo streak. */
  hit: (streak = 0) => tone(520 + Math.min(streak, 20) * 30, 0.09, { type: 'triangle' }),
  miss: () => tone(160, 0.22, { type: 'sawtooth', vol: 0.12, to: 90 }),
  combo: () => [660, 880, 1100].forEach((f, i) => tone(f, 0.12, { type: 'square', vol: 0.08, delay: i * 0.07 })),
  tick: () => tone(880, 0.06, { type: 'square', vol: 0.06 }),
  go: () => tone(1046, 0.25, { type: 'triangle', vol: 0.2 }),
  end: () => [784, 659, 523].forEach((f, i) => tone(f, 0.18, { type: 'triangle', delay: i * 0.12 })),
  medal: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, { type: 'triangle', delay: i * 0.1 })),
}
