import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'

const LANES = 3
const LIVES = 3
/** Depth of the runner: 0 is the far end of the tunnel, 1 the bottom of the screen. */
const PLAYER_Z = 0.86
const HIT_DEPTH = 0.05
const RING_GAP = 0.15
/** How far behind the spawn point the tunnel is still drawn. */
const RING_FROM = -2.2
/** Depth at which things pass the camera. Scale grows without bound towards 1.15. */
const NEAR_Z = 1.08

type Kind = 'rock' | 'bat' | 'jar'
interface Thing { id: number; lane: number; z: number; kind: Kind }

const EMOJI: Record<Kind, string> = { rock: '🪨', bat: '🦇', jar: '🏺' }

export function TunnelCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const [lane, setLane] = useState(1)
  const [frame, setFrame] = useState<{ things: Thing[]; travel: number }>({ things: [], travel: 0 })
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
    let travel = 0
    let last = performance.now()
    let nextSpawn = 700
    let raf = 0
    const tick = (t: number) => {
      const dt = Math.min(50, t - last)
      last = t
      // The run speeds up the longer you survive.
      const speed = (0.00045 + api.elapsed() * 0.000012) * dt
      travel += speed
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
        if (th.z < NEAR_Z) kept.push(th)
      }
      things = kept
      setFrame({ things: [...things], travel })
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
  const [px, py] = project(size, lane, PLAYER_Z)
  return (
    <div ref={root} className="core tunnel" onPointerDown={onDown} onPointerUp={onUp}>
      <svg className="tunnel__floor" width={w} height={h} aria-hidden="true">
        <Tunnel size={size} travel={frame.travel} />
      </svg>
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
        <Runner />
      </div>
      <div className="tunnel__lives">{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</div>
      <p className="tunnel__hint">← stuknij lewą lub prawą stronę →</p>
    </div>
  )
}

/** Screen height of the vanishing point, as a share of the screen. */
/** The runner seen from behind, heading into the tunnel with an oil lamp held high. */
function Runner() {
  return (
    <svg className="tunnel__runner" viewBox="0 0 60 96" aria-hidden="true">
      <ellipse cx="30" cy="93" rx="16" ry="3.5" fill="rgba(0,0,0,.35)" />
      <g className="tunnel__leg tunnel__leg--l"><path d="M24 58 L22 86" stroke="#b07850" strokeWidth="6" strokeLinecap="round" /><path d="M18 88 h8" stroke="#5a3a1e" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="tunnel__leg tunnel__leg--r"><path d="M36 58 L38 86" stroke="#b07850" strokeWidth="6" strokeLinecap="round" /><path d="M34 88 h8" stroke="#5a3a1e" strokeWidth="4" strokeLinecap="round" /></g>
      <path d="M18 30 Q30 24 42 30 L46 64 Q30 68 14 64 Z" fill="#d8c3a0" />
      <path d="M16 46 h28" stroke="#8a5a2b" strokeWidth="3" />
      <path d="M20 32 L12 50" stroke="#b07850" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 32 L50 14" stroke="#b07850" strokeWidth="5" strokeLinecap="round" />
      <circle cx="51" cy="8" r="9" fill="url(#runner-glow)" />
      <path d="M45 13 Q51 17 57 13 Q55 10 51 10 Z" fill="#a0522d" />
      <path d="M51 10 Q49 6 51 2 Q53 6 51 10" fill="#ffcf5a" />
      <circle cx="30" cy="19" r="9" fill="#3b2a1a" />
      <path d="M21 21 Q30 30 39 21" fill="#b07850" opacity=".35" />
      <defs><radialGradient id="runner-glow"><stop offset="0" stopColor="#ffd27a" stopOpacity=".9" /><stop offset="1" stopColor="#ffd27a" stopOpacity="0" /></radialGradient></defs>
    </svg>
  )
}

const HORIZON = 0.3
/** Floor half-width and wall height, in lane spacings at scale 1. */
const FLOOR_HALF = 1.65
const WALL = 1.3

/** Size factor of something at depth z: true perspective, 1 at the runner. */
const scale = (z: number) => (1.15 - PLAYER_Z) / (1.15 - z)

const laneW = (size: { w: number }) => Math.min(size.w * 0.3, 150)

/** Screen position of the bottom of an object in a lane at depth z. Lanes meet at the far end. */
function project(size: { w: number; h: number }, lane: number, z: number): [number, number] {
  const k = scale(z)
  const horizon = size.h * HORIZON
  return [size.w / 2 + (lane - 1) * laneW(size) * k, horizon + (size.h * 0.88 - horizon) * k]
}

const ARC = 8

/** Outline of the tunnel's cross-section at depth z, from the left floor edge round to the right one. */
function ring(size: { w: number; h: number }, z: number): [number, number][] {
  const k = scale(z)
  const [cx, floor] = project(size, 1, z)
  const half = FLOOR_HALF * laneW(size) * k
  // The crown MUST stay above eye level, or the camera ends up outside the vault on tall screens.
  const eye = (size.h * 0.88 - size.h * HORIZON) * k
  const spring = floor - Math.max(WALL * laneW(size) * k, eye * 1.4 - half * 0.85)
  const pts: [number, number][] = [[cx - half, floor]]
  for (let i = 0; i <= ARC; i++) {
    const a = Math.PI - (i / ARC) * Math.PI
    pts.push([cx + Math.cos(a) * half, spring - Math.sin(a) * half * 0.85])
  }
  pts.push([cx + half, floor])
  return pts
}

/** Stone colour lit by the runner's lamp: dark far away, warm close by. */
function shade([r, g, b]: number[], z: number, slab: boolean) {
  const lit = Math.min(1, 0.08 + scale(z) ** 1.3 * 0.9) * (slab ? 1 : 0.88)
  return `rgb(${Math.round(r * lit)},${Math.round(g * lit)},${Math.round(b * lit)})`
}

const FLOOR = [128, 96, 60]
const STONE = [150, 112, 72]

function Tunnel({ size, travel }: { size: { w: number; h: number }; travel: number }) {
  // Rings stay put in the world; the run carries them towards the camera.
  const rings: { z: number; n: number }[] = []
  for (let n = Math.ceil((RING_FROM - travel) / RING_GAP); ; n++) {
    const z = n * RING_GAP + travel
    rings.push({ z: Math.min(z, 1.12), n })
    if (z >= NEAR_Z) break
  }
  const shapes: JSX.Element[] = []
  const far = ring(size, rings[0].z)
  shapes.push(<polygon key="end" points={far.map(p => p.join(',')).join(' ')} fill="#080503" />)
  for (let i = 0; i + 1 < rings.length; i++) {
    const a = ring(size, rings[i].z)
    const b = ring(size, rings[i + 1].z)
    const z = rings[i].z
    const slab = ((rings[i].n % 2) + 2) % 2 === 0
    shapes.push(<polygon key={`f${i}`} points={[a[0], a[a.length - 1], b[b.length - 1], b[0]].map(p => p.join(',')).join(' ')} fill={shade(FLOOR, z, slab)} />)
    for (let j = 0; j + 1 < a.length; j++) {
      // The vault darkens towards its crown.
      const up = j === 0 || j === a.length - 2 ? 1 : 0.8 - Math.sin((j / (a.length - 2)) * Math.PI) * 0.25
      shapes.push(<polygon key={`w${i}-${j}`} points={[a[j], a[j + 1], b[j + 1], b[j]].map(p => p.join(',')).join(' ')} fill={shade(STONE.map(c => c * up), z, slab)} />)
    }
    if (((rings[i].n % 3) + 3) % 3 === 0) {
      // A rib of dressed stone every third ring.
      shapes.push(<polyline key={`r${i}`} points={a.map(p => p.join(',')).join(' ')} fill="none" stroke={shade([60, 42, 24], z, true)} strokeWidth={Math.max(1, 10 * scale(z))} strokeLinejoin="round" />)
    }
  }
  for (const lane of [0.5, 1.5]) {
    const [x0, y0] = project(size, lane, rings[0].z)
    const [x1, y1] = project(size, lane, 1.1)
    shapes.push(<line key={`l${lane}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(255,220,160,.16)" strokeWidth="2" />)
  }
  for (const { z, n } of rings) {
    if (((n % 6) + 6) % 6 !== 0 || z < -0.6 || z > 1.05) continue
    const pts = ring(size, z)
    const k = scale(z)
    for (const [x, y] of [pts[1], pts[pts.length - 2]]) {
      shapes.push(<g key={`t${n}-${x}`} className="tunnel__torch">
        <circle cx={x} cy={y + 18 * k} r={60 * k} fill="url(#tunnel-torch)" />
        <text x={x} y={y + 30 * k} fontSize={34 * k} textAnchor="middle">🔥</text>
      </g>)
    }
  }
  return (
    <>
      <defs>
        <radialGradient id="tunnel-torch">
          <stop offset="0" stopColor="#ffb648" stopOpacity=".45" /><stop offset="1" stopColor="#ffb648" stopOpacity="0" />
        </radialGradient>
      </defs>
      {shapes}
    </>
  )
}
