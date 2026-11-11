import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const BEAT_MS = 650
/** How far from the beat a tap still counts as in rhythm. */
const WINDOW_MS = 140
const ON_BEAT_ML = 10
const JAR_ML = 250
/** Wheel centre inside the press drawing, so the beat ring closes exactly on it. */
const WHEEL = { x: 150, y: 112, r: 62 }
const OLIVES = [[52, 178], [74, 186], [98, 191], [204, 191], [228, 186], [250, 178], [64, 170], [238, 170], [118, 194], [184, 194]]
const TREES = [
  { x: 6, s: 1.15, flip: false }, { x: 70, s: 0.75, flip: true }, { x: 30, s: 0.55, flip: false },
  { x: 86, s: 1.05, flip: true }, { x: 52, s: 0.6, flip: true },
]

/** A gnarled olive tree: twisted trunk, silver-green crown. */
function OliveTree() {
  return (
    <svg viewBox="0 0 120 120">
      {/* Short, thick, twisted trunk that splits low into a few limbs. */}
      <path d="M44 120 C50 108 46 98 52 88 C46 80 38 74 30 70 L34 66 C44 70 50 76 56 80 C58 72 56 64 60 56 L65 57 C63 66 64 74 64 82 C70 76 80 72 90 68 L92 72 C82 78 72 84 68 92 C72 102 70 112 78 120Z" fill="#7a644d" />
      <path d="M54 118 C56 108 54 100 58 92" stroke="#5e4b38" strokeWidth="2" fill="none" />
      <path d="M66 118 C64 110 66 102 64 96" stroke="#5e4b38" strokeWidth="1.5" fill="none" />
      {/* Wide, airy crown in clumps of grey-green with silver undersides. */}
      <g fill="#7c8c62">
        <path d="M6 66 q2 -12 14 -12 q4 -10 16 -6 q8 -6 16 0 q6 8 -2 16 q-10 6 -22 4 q-14 6 -22 -2z" />
        <path d="M40 46 q0 -14 14 -16 q6 -10 18 -6 q12 -4 16 6 q10 2 8 12 q-6 10 -20 8 q-10 6 -22 2 q-12 2 -14 -6z" />
        <path d="M76 66 q-2 -12 10 -14 q8 -8 18 -2 q12 2 10 12 q-4 10 -16 8 q-14 4 -22 -4z" />
      </g>
      <g fill="#a3b08a">
        <path d="M12 62 q6 -6 14 -4 q6 -4 12 0 q-6 4 -14 4 q-6 2 -12 0z" />
        <path d="M48 42 q8 -6 18 -4 q8 -4 16 0 q-8 6 -18 4 q-8 2 -16 0z" />
        <path d="M82 62 q8 -6 16 -2 q6 0 8 4 q-8 2 -14 0 q-6 2 -10 -2z" />
      </g>
      <g fill="#c4ccb0" opacity=".7">
        <ellipse cx="30" cy="54" rx="6" ry="2.5" /><ellipse cx="66" cy="32" rx="7" ry="2.5" /><ellipse cx="96" cy="54" rx="5" ry="2" />
      </g>
    </svg>
  )
}

/** Hills, the Old City wall across the valley, olive trees and a stone terrace. */
function Grove() {
  return (
    <div className="grove" aria-hidden="true">
      <svg className="grove__far" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice">
        <path d="M0 70 Q80 40 170 62 T400 50 V120 H0Z" fill="#b9c99f" />
        <g fill="#d8c79c">
          <rect x="120" y="54" width="170" height="22" />
          {Array.from({ length: 17 }, (_, i) => <rect key={i} x={120 + i * 10} y="49" width="6" height="6" />)}
          <rect x="196" y="40" width="20" height="16" />
        </g>
        <circle cx="206" cy="40" r="11" fill="#e2b13c" />
        <path d="M0 96 Q100 70 220 90 T400 84 V120 H0Z" fill="#a7bb8a" />
      </svg>
      {TREES.map((t, i) => (
        <div key={i} className="grove__tree" style={{ left: `${t.x}%`, width: 150 * t.s, height: 150 * t.s, zIndex: t.s > 0.9 ? 2 : 0, opacity: t.s > 0.9 ? 1 : 0.85, transform: t.flip ? 'scaleX(-1)' : undefined }}>
          <OliveTree />
        </div>
      ))}
      <div className="grove__terrace" />
    </div>
  )
}

export function OlivePressCore({ api }: CoreProps) {
  const [ml, setMl] = useState(0)
  const [beat, setBeat] = useState(0)
  const stone = useRef<SVGGElement>(null)
  const [drip, setDrip] = useState(0)
  const angle = useRef(0)
  const t0 = useRef(performance.now())
  const lastBeatTapped = useRef(-1)

  useEffect(() => {
    t0.current = performance.now()
    const iv = setInterval(() => setBeat(Math.floor((performance.now() - t0.current) / BEAT_MS)), 40)
    return () => clearInterval(iv)
  }, [])

  // Tap when the ring closes on the stone, like pushing a real millstone in rhythm.
  const press = (e: React.PointerEvent<HTMLDivElement>) => {
    const at = pointIn(e)
    const t = performance.now() - t0.current
    const nearest = Math.round(t / BEAT_MS)
    const off = Math.abs(t - nearest * BEAT_MS)
    if (off > WINDOW_MS || nearest === lastBeatTapped.current) {
      api.miss(0, at, 'Poza rytmem')
      return
    }
    lastBeatTapped.current = nearest
    angle.current += 40
    if (stone.current) stone.current.style.transform = `rotate(${angle.current}deg)`
    setMl(v => v + ON_BEAT_ML)
    setDrip(d => d + 1)
    api.hit(ON_BEAT_ML, at, off < WINDOW_MS / 3 ? 'Idealnie!' : undefined)
  }

  return (
    <div className="core core--tap" onPointerDown={press}>
      <Grove />
      <svg className="press" viewBox="0 0 300 240" aria-hidden="true">
        <ellipse cx="150" cy="222" rx="140" ry="16" fill="rgba(0,0,0,.18)" />
        {/* Stone basin: rim, wall and the olive mash inside. */}
        <path d="M14 172 V196 Q150 250 286 196 V172Z" fill="#9a8a6c" />
        <path d="M14 196 Q150 250 286 196" stroke="#7d6e52" strokeWidth="3" fill="none" />
        <ellipse cx="150" cy="172" rx="136" ry="38" fill="#b6a685" stroke="#8a7a5c" strokeWidth="4" />
        <ellipse cx="150" cy="176" rx="116" ry="28" fill="#6f6236" />
        <ellipse cx="150" cy="178" rx="112" ry="24" fill="#8a7a32" opacity={0.35 + Math.min(1, ml / JAR_ML) * 0.5} />
        {OLIVES.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7" ry="5" fill={i % 3 ? '#5a6b2a' : '#3d2a3a'} opacity={Math.max(0, 1 - ml / JAR_ML - (i % 4) * 0.12)} />)}
        <path d="M282 184 L300 190 L300 196 L284 192Z" fill="#8a7a5c" />
        {/* Wooden beam through the wheel to the central post. */}
        <rect x="146" y="40" width="8" height="140" rx="3" fill="#6b4a2a" />
        <path d="M150 112 L290 92" stroke="#7a5430" strokeWidth="10" strokeLinecap="round" />
        <g ref={stone} className="press__wheel">
          <circle cx={WHEEL.x} cy={WHEEL.y} r={WHEEL.r} fill="#c2b391" stroke="#8c7d5f" strokeWidth="6" />
          <circle cx={WHEEL.x} cy={WHEEL.y} r={WHEEL.r - 14} fill="none" stroke="#a89775" strokeWidth="2" strokeDasharray="6 8" />
          {[[-30, -20, 5], [18, -32, 3.5], [28, 14, 4.5], [-16, 30, 3], [-38, 8, 2.5], [6, 4, 2]].map(([dx, dy, r], i) => <circle key={i} cx={WHEEL.x + dx} cy={WHEEL.y + dy} r={r} fill="#9e8e6c" />)}
          <path d={`M${WHEEL.x - 44} ${WHEEL.y - 30} q10 -8 18 -4`} stroke="#d6c8a6" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx={WHEEL.x} cy={WHEEL.y} r="11" fill="#5a3e22" />
        </g>
        {drip > 0 && <circle key={drip} className="press__drip" cx="298" cy="196" r="4" fill="#d8b52a" />}
      </svg>
      <div key={beat} className="press__ring" style={{ animationDuration: `${BEAT_MS}ms` }} />
      <div className="press__jar"><div className="press__oil" style={{ height: `${Math.min(1, ml / JAR_ML) * 100}%` }} /></div>
      <p className="press__hint">Stuknij, gdy pierścień dotknie kamienia</p>
    </div>
  )
}
