import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'

const LANES = 3
const LIVES = 3
const PLAYER_FROM_BOTTOM = 110

interface Thing { id: number; lane: number; y: number; kind: 'rock' | 'bat' | 'jar' }

const EMOJI = { rock: '🪨', bat: '🦇', jar: '🏺' } as const

export function TunnelCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const [lane, setLane] = useState(1)
  const [things, setThings] = useState<Thing[]>([])
  const [lives, setLives] = useState(LIVES)
  const [size, setSize] = useState({ w: 320, h: 600 })
  const laneRef = useRef(1)
  const livesRef = useRef(LIVES)
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    const el = root.current!
    const s = { w: el.clientWidth, h: el.clientHeight }
    setSize(s)
    const playerY = s.h - PLAYER_FROM_BOTTOM
    let list: Thing[] = []
    let last = performance.now()
    let nextSpawn = 600
    let raf = 0
    let id = 0
    const tick = (t: number) => {
      const dt = Math.min(50, t - last)
      last = t
      // The tunnel speeds up the longer you survive.
      const speed = (0.22 + api.elapsed() * 0.006) * dt
      nextSpawn -= dt
      if (nextSpawn <= 0) {
        nextSpawn = Math.max(380, 900 - api.elapsed() * 12)
        const kind = Math.random() < 0.35 ? 'jar' : Math.random() < 0.5 ? 'bat' : 'rock'
        list.push({ id: ++id, lane: Math.floor(Math.random() * LANES), y: -40, kind })
      }
      const kept: Thing[] = []
      for (const th of list) {
        th.y += speed
        const near = Math.abs(th.y - playerY) < 30 && th.lane === laneRef.current
        if (near) {
          const at = { x: (s.w * (th.lane + 0.5)) / LANES, y: playerY - 30 }
          if (th.kind === 'jar') api.hit(1, at, '+💧')
          else {
            livesRef.current -= 1
            setLives(livesRef.current)
            api.miss(0, at, th.kind === 'bat' ? 'Nietoperz!' : 'Au, skała!')
            if (livesRef.current <= 0) {
              api.finish()
              return
            }
          }
          continue
        }
        if (th.y < s.h + 40) kept.push(th)
      }
      list = kept
      setThings([...list])
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [api])

  const move = (d: number) => {
    laneRef.current = Math.max(0, Math.min(LANES - 1, laneRef.current + d))
    setLane(laneRef.current)
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

  const laneX = (l: number) => (size.w * (l + 0.5)) / LANES
  return (
    <div ref={root} className="core tunnel" onPointerDown={onDown} onPointerUp={onUp}>
      <div className="tunnel__walls" />
      {[1, 2].map(i => <div key={i} className="tunnel__lane" style={{ left: `${(i * 100) / LANES}%` }} />)}
      <div className="tunnel__lives">{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</div>
      {things.map(t => (
        <div key={t.id} className="sprite tunnel__thing" style={{ transform: `translate(${laneX(t.lane) - 18}px,${t.y - 18}px)` }}>{EMOJI[t.kind]}</div>
      ))}
      <div className="tunnel__light" style={{ left: laneX(lane), top: size.h - PLAYER_FROM_BOTTOM }} />
      <div className="sprite tunnel__player" style={{ transform: `translate(${laneX(lane) - 20}px,${size.h - PLAYER_FROM_BOTTOM - 20}px)` }}>🏃</div>
      <p className="tunnel__hint">← stuknij lewą lub prawą stronę →</p>
    </div>
  )
}
