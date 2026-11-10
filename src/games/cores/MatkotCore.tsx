import { useEffect, useRef } from 'react'
import type { CoreProps } from '../types'

/** Ball progress from which a tap counts as a hit (1 = at the player's paddle). */
const HIT_FROM = 0.78
const MISS_AT = 1.12
const CHEERS = ['Plask!', 'Tak!', 'Yalla!', 'Sababa!', 'Ale odbicie!', 'Kosmos!']

interface Ball { p: number; dir: 1 | -1; v: number; x0: number; x1: number }

export function MatkotCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const ballEl = useRef<HTMLDivElement>(null)
  const shadowEl = useRef<HTMLDivElement>(null)
  const paddleEl = useRef<HTMLDivElement>(null)
  const ball = useRef<Ball>({ p: 0, dir: 1, v: 0.011, x0: 0.5, x1: 0.5 })
  const geo = useRef({ w: 320, top: 70, bottom: 400 })
  const over = useRef(false)
  const hits = useRef(0)

  useEffect(() => {
    const el = root.current!
    geo.current = { w: el.clientWidth, top: 70, bottom: el.clientHeight - 90 }
    let raf = 0
    const tick = () => {
      const b = ball.current
      const { w, top, bottom } = geo.current
      b.p += b.dir * b.v
      if (b.dir < 0 && b.p <= 0) {
        // The opponent always returns the ball, aimed somewhere new.
        b.p = 0
        b.dir = 1
        b.x0 = b.x1
        b.x1 = 0.15 + Math.random() * 0.7
      }
      if (b.dir > 0 && b.p > MISS_AT && !over.current) {
        over.current = true
        api.miss(0, undefined, 'Piłka w piasku!')
        api.finish()
        return
      }
      const x = (b.dir > 0 ? b.x0 + (b.x1 - b.x0) * b.p : b.x1 + (b.x0 - b.x1) * (1 - b.p)) * w
      const y = top + b.p * (bottom - top)
      const arc = Math.sin(Math.min(1, b.p) * Math.PI) * 60
      if (ballEl.current) ballEl.current.style.transform = `translate(${x - 11}px,${y - 11 - arc}px)`
      if (shadowEl.current) shadowEl.current.style.transform = `translate(${x - 12}px,${y + 8}px) scale(${1 - arc / 120})`
      if (paddleEl.current) paddleEl.current.style.transform = `translate(${b.x1 * w - 28}px,${bottom - 12}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [api])

  const tap = () => {
    const b = ball.current
    if (over.current || b.dir < 0) return
    const { w, top, bottom } = geo.current
    const at = { x: b.x1 * w, y: top + Math.min(1, b.p) * (bottom - top) - 30 }
    if (b.p < HIT_FROM) {
      over.current = true
      api.miss(0, at, 'Za wcześnie!')
      api.finish()
      return
    }
    b.dir = -1
    b.v *= 1.06
    hits.current += 1
    api.hit(1, at, CHEERS[hits.current % CHEERS.length])
    paddleEl.current?.animate([{ rotate: '0deg' }, { rotate: '-35deg' }, { rotate: '0deg' }], { duration: 180 })
  }

  const zoneTop = geo.current.top + HIT_FROM * (geo.current.bottom - geo.current.top)
  return (
    <div ref={root} className="core core--tap" onPointerDown={tap}>
      <div className="matkot__sea" />
      <div className="matkot__zone" style={{ top: `calc(${zoneTop}px - 10px)` }} />
      <div className="sprite matkot__opponent">🧔‍♂️</div>
      <div ref={shadowEl} className="sprite matkot__shadow" />
      <div ref={ballEl} className="sprite matkot__ball" />
      <div ref={paddleEl} className="sprite matkot__paddle" />
    </div>
  )
}
