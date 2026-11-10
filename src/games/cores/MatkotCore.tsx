import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'

/** Ball progress from which a tap counts as a hit (1 = at the player's paddle). */
const HIT_FROM = 0.78
const MISS_AT = 1.12
const ARC = 60
const WIND_FROM = 8
const CHEERS = ['Plask!', 'Tak!', 'Yalla!', 'Sababa!', 'Ale odbicie!', 'Kosmos!']
const MILESTONES: Record<number, string> = {
  10: 'Ale wymiana!',
  20: 'Cała plaża patrzy!',
  30: 'Legenda Tel Awiwu!',
  50: 'Mistrz matkot!',
}
const CROWD = ['🧍', '🧍‍♀️', '👀', '🙋', '🤳', '🧒', '👵', '🕺']

type Side = 'left' | 'right'
interface Ball { p: number; dir: 1 | -1; v: number; x0: number; x1: number }

const sideOf = (x: number): Side => (x < 0.5 ? 'left' : 'right')

export function MatkotCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const ballEl = useRef<HTMLDivElement>(null)
  const shadowEl = useRef<HTMLDivElement>(null)
  const ball = useRef<Ball>({ p: 0, dir: 1, v: 0.011, x0: 0.5, x1: 0.3 })
  const geo = useRef({ w: 320, top: 70, bottom: 400 })
  const over = useRef(false)
  const hitsRef = useRef(0)
  const windRef = useRef(0)
  const [hits, setHits] = useState(0)
  const [paddle, setPaddle] = useState<Side>('left')
  const [wind, setWind] = useState(0)
  const [zone, setZone] = useState<{ top: number; height: number } | null>(null)

  useEffect(() => {
    const el = root.current!
    geo.current = { w: el.clientWidth, top: 90, bottom: el.clientHeight - 90 }
    // The zone covers where the ball is drawn (arc included) while a tap counts as a hit.
    const drawnY = (p: number) => geo.current.top + p * (geo.current.bottom - geo.current.top) - Math.sin(Math.min(1, p) * Math.PI) * ARC
    const zTop = drawnY(HIT_FROM) - 12
    setZone({ top: zTop, height: drawnY(1.06) + 12 - zTop })
    let raf = 0
    const tick = () => {
      const b = ball.current
      const { w, top, bottom } = geo.current
      b.p += b.dir * b.v
      if (b.dir < 0 && b.p <= 0) {
        // The opponent returns to a random side; past the first rallies the wind pushes the ball.
        b.p = 0
        b.dir = 1
        b.x0 = b.x1
        b.x1 = Math.min(0.88, Math.max(0.12, 0.15 + Math.random() * 0.7 + windRef.current))
      }
      if (b.dir > 0 && b.p > MISS_AT && !over.current) {
        over.current = true
        api.miss(0, undefined, 'Piłka w piasku!')
        api.finish()
        return
      }
      const x = (b.dir > 0 ? b.x0 + (b.x1 - b.x0) * b.p : b.x1 + (b.x0 - b.x1) * (1 - b.p)) * w
      const y = top + b.p * (bottom - top)
      const arc = Math.sin(Math.min(1, b.p) * Math.PI) * ARC
      if (ballEl.current) ballEl.current.style.transform = `translate(${x - 11}px,${y - 11 - arc}px)`
      if (shadowEl.current) shadowEl.current.style.transform = `translate(${x - 12}px,${y + 8}px) scale(${1 - arc / 120})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [api])

  // Tap the side of the beach where the ball is coming down.
  const tap = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = ball.current
    if (over.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const side: Side = e.clientX - r.left < r.width / 2 ? 'left' : 'right'
    setPaddle(side)
    if (b.dir < 0) return
    const { w, top, bottom } = geo.current
    const at = { x: b.x1 * w, y: top + Math.min(1, b.p) * (bottom - top) - 30 }
    if (b.p < HIT_FROM || side !== sideOf(b.x1)) {
      over.current = true
      api.miss(0, at, b.p < HIT_FROM ? 'Za wcześnie!' : 'Zła strona!')
      api.finish()
      return
    }
    b.dir = -1
    b.v *= 1.05
    hitsRef.current += 1
    const n = hitsRef.current
    setHits(n)
    api.hit(1, at, CHEERS[n % CHEERS.length])
    if (MILESTONES[n]) api.announce(MILESTONES[n])
    if (n >= WIND_FROM && n % 4 === 0) {
      windRef.current = (Math.random() - 0.5) * 0.3
      setWind(windRef.current)
    }
  }

  const crowd = Math.min(CROWD.length * 2, Math.floor(hits / 3))
  return (
    <div ref={root} className="core core--tap" onPointerDown={tap}>
      <div className="matkot__sea" />
      <div className="matkot__crowd">{Array.from({ length: crowd }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 4) * 0.1}s` }}>{CROWD[i % CROWD.length]}</span>)}</div>
      {wind !== 0 && <div className="matkot__wind">💨 wiatr {wind > 0 ? '→' : '←'}</div>}
      {zone && <div className="matkot__zone" style={{ top: zone.top, height: zone.height }}><span /></div>}
      <div className="sprite matkot__opponent">🧔‍♂️</div>
      <div ref={shadowEl} className="sprite matkot__shadow" />
      <div ref={ballEl} className="sprite matkot__ball" />
      <div className="sprite matkot__paddle" data-side={paddle} />
    </div>
  )
}
