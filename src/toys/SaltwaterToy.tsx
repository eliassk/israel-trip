import { useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'

/** Salt content in percent: start in the Baltic, end in the Dead Sea. */
const START = 0.7
const STEP = 3.5
const DEAD_SEA = 34
const WATER = 132

const pct = (v: number) => v.toFixed(1).replace('.', ',')

const caption = (v: number) =>
  v < 2 ? 'Bałtyk: sól 0,7%. Trzeba machać rękami, żeby nie zatonąć.'
  : v < 6 ? `Sól ${pct(v)}%, jak w Morzu Śródziemnym. Dalej machasz.`
  : v < 20 ? `Sól ${pct(v)}%. Woda zaczyna cię wypychać do góry!`
  : v < 30 ? `Sól ${pct(v)}%. Prawie leżysz na wodzie.`
  : 'Morze Martwe: sól 34%! Leżysz jak na materacu i czytasz gazetę.'

export function SaltwaterToy({ onDone }: ToyProps) {
  const [salt, setSalt] = useState(START)
  const [pours, setPours] = useState(0)
  const t = Math.min(1, (salt - START) / (DEAD_SEA - START))
  const done = salt >= DEAD_SEA

  const pour = () => {
    if (done) return
    const v = Math.min(DEAD_SEA, salt + STEP)
    setSalt(v)
    setPours(p => p + 1)
    if (v >= DEAD_SEA) onDone()
  }

  // The swimmer turns from upright (treading water) to lying flat, and rises out of the water.
  const angle = 90 * (1 - t)
  const headY = WATER - 4 - t * 10
  const water = `hsl(${196 - t * 26}, ${48 - t * 8}%, ${46 + t * 14}%)`
  return (
    <Stage background="#f3dcb0" height={300} message={caption(salt)}>
      <svg className="sea" viewBox="0 0 400 300" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <rect width="400" height={WATER} fill="#f6e3bb" />
        <path d={`M0 ${WATER} L0 86 Q40 62 90 78 T190 70 T300 82 T400 66 V${WATER}Z`} fill="#d9a98a" opacity=".7" />
        <path d={`M0 ${WATER} L0 104 Q70 90 150 102 T300 98 T400 94 V${WATER}Z`} fill="#c99278" opacity=".6" />
        <rect y={WATER} width="400" height={300 - WATER} fill={water} style={{ transition: 'fill .4s' }} />
        <g fill="#fbf8ef" opacity={0.3 + t * 0.7}><ellipse cx="40" cy={WATER + 6} rx="22" ry="5" /><ellipse cx="350" cy={WATER + 8} rx="28" ry="6" /><ellipse cx="300" cy={WATER + 4} rx="10" ry="3" /></g>
        <g transform={`translate(170 ${headY}) rotate(${angle})`} style={{ transition: 'transform .5s ease-out' }}>
          <path d="M60 2 L104 -2 M60 6 L104 8" stroke="#c98d62" strokeWidth="9" strokeLinecap="round" />
          <rect x="12" y="-10" width="52" height="22" rx="10" fill="#e4572e" />
          {t > 0.85 ? (
            <g>
              <path d="M24 -8 L40 -26 M44 -8 L52 -26" stroke="#c98d62" strokeWidth="6" strokeLinecap="round" />
              <rect x="30" y="-46" width="34" height="24" fill="#f4f1e8" stroke="#bbb" transform="rotate(-8 47 -34)" />
              <path d="M34 -40 h24 M34 -35 h24 M34 -30 h16" stroke="#999" strokeWidth="1.5" transform="rotate(-8 47 -34)" />
            </g>
          ) : (
            <g className={t < 0.4 ? 'sea__flail' : undefined}>
              <path d="M22 -8 L14 -30 M22 10 L14 30" stroke="#c98d62" strokeWidth="6" strokeLinecap="round" />
            </g>
          )}
          <circle cx="0" cy="0" r="13" fill="#c98d62" />
          <path d="M-13 -2 a13 13 0 0 1 22 -9 q-8 2 -22 9z" fill="#3b2a1a" />
        </g>
        {/* Water in front: what is under the surface reads as submerged. */}
        <rect y={WATER} width="400" height={300 - WATER} fill={water} opacity=".55" style={{ transition: 'fill .4s' }} />
        <path d={`M0 ${WATER} q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} stroke="rgba(255,255,255,.6)" strokeWidth="2" fill="none" />
        {pours > 0 && !done && <g key={pours} className="sea__grains">{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={322 + (i % 5) * 6} cy={50 + Math.floor(i / 5) * 8} r="2" fill="#fff" />)}</g>}
      </svg>
      <div className="sea__gauge"><i style={{ height: `${t * 100}%` }} /><span style={{ bottom: `${(4 - START) / (DEAD_SEA - START) * 100}%` }}>ocean</span><span style={{ bottom: '100%' }}>Martwe</span></div>
      {!done && <button className="btn sea__pour" onClick={pour}>🧂 Dosyp soli</button>}
    </Stage>
  )
}
