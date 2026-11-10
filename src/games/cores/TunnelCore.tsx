import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'

const LANES = 3
const LIVES = 3
/** Depth of the runner: 0 is the far end of the tunnel, 1 the bottom of the screen. */
const PLAYER_Z = 0.86
const HIT_DEPTH = 0.05
const ARCH_GAP = 0.18

type Kind = 'rock' | 'bat' | 'jar'
interface Thing { id: number; lane: number; z: number; kind: Kind }
interface Arch { id: number; z: number }

const EMOJI: Record<Kind, string> = { rock: '🪨', bat: '🦇', jar: '🏺' }

export function TunnelCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const [lane, setLane] = useState(1)
  const [frame, setFrame] = useState<{ things: Thing[]; arches: Arch[] }>({ things: [], arches: [] })
  const [lives, setLives] = useState(LIVES)
  const [size, setSize] = useState({ w: 320, h: 600 })
  const [tilt, setTilt] = useState(0)
  const laneRef = useRef(1)
  const livesRef = useRef(LIVES)
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    const el = root.current!
    const s = { w: el.clientWidth, h: el.clientHeight }
    setSize(s)
    let things: Thing[] = []
    let id = 0
    let arches: Arch[] = Array.from({ length: 6 }, (_, i) => ({ id: ++id, z: i * ARCH_GAP }))
    let last = performance.now()
    let nextSpawn = 700
    let raf = 0
    const tick = (t: number) => {
      const dt = Math.min(50, t - last)
      last = t
      // The run speeds up the longer you survive.
      const speed = (0.00045 + api.elapsed() * 0.000012) * dt
      arches = arches.map(a => ({ ...a, z: a.z + speed })).filter(a => a.z < 1.25)
      if (arches.length === 0 || Math.min(...arches.map(a => a.z)) > ARCH_GAP) arches.push({ id: ++id, z: 0 })
      nextSpawn -= dt
      if (nextSpawn <= 0) {
        nextSpawn = Math.max(420, 950 - api.elapsed() * 12)
        const kind: Kind = Math.random() < 0.35 ? 'jar' : Math.random() < 0.5 ? 'bat' : 'rock'
        things.push({ id: ++id, lane: Math.floor(Math.random() * LANES), z: 0, kind })
      }
      const kept: Thing[] = []
      for (const th of things) {
        th.z += speed
        if (th.lane === laneRef.current && Math.abs(th.z - PLAYER_Z) < HIT_DEPTH) {
          const [x, y] = project(s, th.lane, PLAYER_Z)
          if (th.kind === 'jar') api.hit(1, { x, y: y - 90 }, '+💧')
          else {
            livesRef.current -= 1
            setLives(livesRef.current)
            api.miss(0, { x, y: y - 90 }, th.kind === 'bat' ? 'Nietoperz!' : 'Au, skała!')
            if (livesRef.current <= 0) {
              api.finish()
              return
            }
          }
          continue
        }
        if (th.z < 1.2) kept.push(th)
      }
      things = kept
      setFrame({ things: [...things], arches: [...arches] })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [api])

  const move = (d: number) => {
    const next = Math.max(0, Math.min(LANES - 1, laneRef.current + d))
    if (next === laneRef.current) return
    laneRef.current = next
    setLane(next)
    setTilt(d * 14)
    setTimeout(() => setTilt(0), 160)
  }

  // Tap the left or right half, or swipe, to change lanes.
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => { touchX.current = e.clientX }
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (touchX.current == null) return
    const dx = e.clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 30) return move(dx > 0 ? 1 : -1)
    const r = e.currentTarget.getBoundingClientRect()
    move(e.clientX - r.left < r.width / 2 ? -1 : 1)
  }

  const { w, h } = size
  const horizon = h * HORIZON
  const [px, py] = project(size, lane, PLAYER_Z)
  return (
    <div ref={root} className="core tunnel" onPointerDown={onDown} onPointerUp={onUp}>
      <svg className="tunnel__floor" width={w} height={h} aria-hidden="true">
        <defs>
          <radialGradient id="tunnel-end" cx="50%" cy="0%" r="60%">
            <stop offset="0" stopColor="#f6c56b" stopOpacity=".55" /><stop offset="1" stopColor="#f6c56b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <polygon points={`${w / 2 - 12},${horizon} ${w / 2 + 12},${horizon} ${w},${h} 0,${h}`} fill="#3a2a18" />
        <ellipse cx={w / 2} cy={horizon} rx={w * 0.5} ry={h * 0.5} fill="url(#tunnel-end)" />
        {[1, 2].map(i => {
          const [x0] = project(size, i - 0.5, 0)
          const [x1] = project(size, i - 0.5, 1.2)
          return <line key={i} x1={x0} y1={horizon} x2={x1} y2={h * 1.2} stroke="rgba(255,220,160,.18)" strokeWidth="2" />
        })}
      </svg>
      {frame.arches.map(({ id, z }) => {
        const k = scale(z)
        const [, y] = project(size, 1, z)
        return (
          <div key={id} className="tunnel__arch" style={{
            width: w * 1.15 * k, height: (h - horizon) * 1.1 * k,
            left: w / 2 - (w * 1.15 * k) / 2, top: y - (h - horizon) * 1.1 * k,
            borderWidth: Math.max(2, 26 * k), opacity: Math.min(1, z * 3),
          }}>
            {z > 0.2 && <><span className="tunnel__torch" style={{ fontSize: 30 * k, left: -6 * k }}>🔥</span><span className="tunnel__torch" style={{ fontSize: 30 * k, right: -6 * k }}>🔥</span></>}
          </div>
        )
      })}
      {frame.things.map(t => {
        const k = scale(t.z)
        const [x, y] = project(size, t.lane, t.z)
        return (
          <div key={t.id} className={`sprite tunnel__thing tunnel__thing--${t.kind}`}
            style={{ fontSize: 64 * k, transform: `translate(${x}px,${y}px) translate(-50%,-100%)`, zIndex: Math.round(t.z * 100), opacity: Math.min(1, t.z * 4) }}>
            {EMOJI[t.kind]}
          </div>
        )
      })}
      <div className="tunnel__light" style={{ left: px, top: py - 60 }} />
      <div className="sprite tunnel__player" style={{ transform: `translate(${px}px,${py}px) translate(-50%,-100%) rotate(${tilt}deg)`, zIndex: Math.round(PLAYER_Z * 100) }}>
        <span className="tunnel__runner">🏃</span>
        <span className="tunnel__carry">🪔</span>
      </div>
      <div className="tunnel__lives">{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</div>
      <p className="tunnel__hint">← stuknij lewą lub prawą stronę →</p>
    </div>
  )
}

const HORIZON = 0.2

/** Size factor of something at depth z. */
const scale = (z: number) => 0.12 + z * 1.0

/** Screen position of the bottom of an object in a lane at depth z. Lanes meet at the far end. */
function project(size: { w: number; h: number }, lane: number, z: number): [number, number] {
  const horizon = size.h * HORIZON
  const y = horizon + (size.h - horizon) * z ** 1.5
  const x = size.w / 2 + (lane - 1) * size.w * 0.34 * scale(z)
  return [x, y]
}
