import { useEffect, useMemo, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'

/** City blocks on the horizon: x, width, height in the 400×280 scene. */
const BLOCKS = [[6, 22, 34], [30, 16, 48], [48, 26, 28], [76, 14, 56], [92, 24, 38], [118, 18, 30], [138, 28, 44], [168, 16, 26], [186, 22, 36]]
const HORIZON = 196

export function NightSkyToy({ onDone }: ToyProps) {
  const [off, setOff] = useState<Set<number>>(new Set())
  const [meteors, setMeteors] = useState<{ x: number; y: number; id: number }[]>([])
  const stage = useRef<HTMLDivElement>(null)
  const stars = useMemo(() => Array.from({ length: 160 }, () => ({ x: Math.random() * 100, y: Math.random() * 62, z: Math.random() * 2 + 1, o: 0.3 + Math.random() * 0.7, t: Math.random() * 3 })), [])
  const dark = off.size / BLOCKS.length
  const done = off.size === BLOCKS.length

  // Tap a lit block to switch it off; the sky fills with stars as the city goes dark.
  const switchOff = (i: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setOff(o => (o.has(i) ? o : new Set(o).add(i)))
  }
  useEffect(() => { if (done) onDone() }, [done])
  const meteor = (e: React.MouseEvent) => {
    if (!done || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    setMeteors(ms => [...ms.slice(-4), { x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() }])
  }

  return (
    <Stage stageRef={stage} height={300} background="#070b17" onClick={meteor}
      message={done ? '„Spójrz na niebo i policz gwiazdy” (Rdz 15,5). Stuknij niebo!' : `Stukaj w bloki miasta, żeby zgasić światła (${off.size}/${BLOCKS.length})`}>
      <div className="milkyway" style={{ opacity: dark * dark }} />
      {stars.map((s, i) => (
        <div key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.z, height: s.z, opacity: Math.max(0, dark * 1.4 - 0.4) * s.o, animationDelay: `${s.t}s` }} />
      ))}
      <div className="city-glow" style={{ opacity: 1 - dark }} />
      <svg className="desert" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">
        <circle cx="330" cy="60" r="16" fill="#f4ecd0" opacity={0.3 + dark * 0.7} />
        <circle cx="336" cy="56" r="14" fill="#070b17" opacity={0.3 + dark * 0.7} />
        {/* Distant city: each block is a tap target. */}
        {BLOCKS.map(([x, w, h], i) => {
          const lit = !off.has(i)
          return (
            <g key={i} className={`desert__block${lit ? ' is-lit' : ''}`} onClick={e => switchOff(i, e)}>
              <rect x={x} y={HORIZON - h} width={w} height={h} fill={lit ? '#3a3448' : '#15131d'} />
              {Array.from({ length: Math.floor(h / 9) * Math.floor(w / 7) }, (_, k) => {
                const cols = Math.floor(w / 7)
                return <rect key={k} x={x + 3 + (k % cols) * 7} y={HORIZON - h + 4 + Math.floor(k / cols) * 9} width="3" height="4" fill={lit ? '#ffcf6b' : '#26222f'} />
              })}
            </g>
          )
        })}
        <path d={`M0 ${HORIZON} Q100 ${HORIZON - 14} 200 ${HORIZON - 4} T400 ${HORIZON - 10} V300 H0Z`} fill="#2a1f1a" />
        <path d={`M0 ${HORIZON + 30} Q120 ${HORIZON + 6} 250 ${HORIZON + 24} T400 ${HORIZON + 14} V300 H0Z`} fill="#1d1612" />
        {/* Bedouin camp: tent, camel and a campfire that keeps burning. */}
        <path d="M262 214 L300 186 L346 214 Z" fill="#3b2a20" />
        <path d="M262 214 L300 186 L300 214 Z" fill="#4a3628" />
        <path d="M292 214 L300 200 L308 214Z" fill={`rgba(255,170,80,${0.35 + dark * 0.3})`} />
        <path d="M360 214 q-2 -12 6 -16 q2 -8 8 -6 l2 6 q6 2 4 10 l-2 6 m-14 0 v-6 m10 6 v-6" stroke="#2a1f1a" strokeWidth="3" fill="#2a1f1a" />
        <circle cx="240" cy="218" r="22" fill="url(#fire-glow)" />
        <path className="desert__fire" d="M234 222 q2 -10 6 -14 q2 6 6 8 q2 4 -2 6z" fill="#ffb23f" />
        <path d="M230 224 h20" stroke="#5a3a22" strokeWidth="3" strokeLinecap="round" />
        <defs><radialGradient id="fire-glow"><stop offset="0" stopColor="#ff9a3a" stopOpacity=".7" /><stop offset="1" stopColor="#ff9a3a" stopOpacity="0" /></radialGradient></defs>
      </svg>
      {meteors.map(m => <div key={m.id} className="meteor" style={{ left: m.x, top: m.y }} />)}
    </Stage>
  )
}
