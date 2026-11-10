import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const FRIEND_PENALTY = 50
const MISS_PENALTY = 5
const ROUNDS = ['Runda 1: tarcze', 'Runda 2: ruchome tarcze', 'Runda 3: zakładnicy'] as const

interface Target { id: number; x: number; y: number; vx: number; r: number; friend: boolean; born: number; until: number }

export function RangeCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const [targets, setTargets] = useState<Target[]>([])
  const [holes, setHoles] = useState<{ id: number; x: number; y: number }[]>([])
  const [round, setRound] = useState(0)

  useEffect(() => {
    let nextSpawn = Date.now() + 600
    let last = Date.now()
    let current = -1
    let id = 0
    const iv = setInterval(() => {
      const now = Date.now()
      const dt = (now - last) / 1000
      last = now
      const p = api.progress()
      const r = Math.min(2, Math.floor(p * 3))
      if (r !== current) {
        current = r
        setRound(r)
        api.announce(ROUNDS[r])
      }
      const pace = 1 + p
      const el = root.current!
      const w = el.clientWidth
      const h = el.clientHeight
      // State updaters MUST stay pure (StrictMode runs them twice), so spawning is decided here.
      const spawned: Target[] = []
      if (now >= nextSpawn) {
        nextSpawn = now + (700 + Math.random() * 400) / pace
        const x = 50 + Math.random() * (w - 100)
        const y = 110 + Math.random() * (h - 180)
        const until = now + 1600 / pace
        if (r === 2 && Math.random() < 0.6) {
          // A hostage stands right next to the threat: only a precise shot counts.
          const side = Math.random() < 0.5 ? -1 : 1
          spawned.push({ id: ++id, x, y, vx: 0, r: 22, friend: false, born: now, until })
          spawned.push({ id: ++id, x: x + side * 46, y: y + 6, vx: 0, r: 28, friend: true, born: now, until })
        } else {
          const vx = r >= 1 ? (Math.random() < 0.5 ? -1 : 1) * (70 + Math.random() * 90) : 0
          spawned.push({ id: ++id, x, y, vx, r: 30, friend: Math.random() < 0.22, born: now, until })
        }
      }
      setTargets(prev => [
        ...prev.filter(t => t.until > now).map(t => {
          let x = t.x + t.vx * dt
          let vx = t.vx
          if (x < 30 || x > w - 30) { vx = -vx; x = Math.max(30, Math.min(w - 30, x)) }
          return { ...t, x, vx }
        }),
        ...spawned,
      ])
    }, 33)
    return () => clearInterval(iv)
  }, [api])

  const shoot = (e: React.PointerEvent<HTMLDivElement>) => {
    const at = pointIn(e)
    const now = Date.now()
    setHoles(h => [...h.slice(-12), { id: now, ...at }])
    // The closest target under the shot counts, so a hostage next to a threat is hit only when aimed at.
    const hit = targets
      .filter(t => Math.hypot(t.x - at.x, t.y - at.y) < t.r)
      .sort((a, b) => Math.hypot(a.x - at.x, a.y - at.y) - Math.hypot(b.x - at.x, b.y - at.y))[0]
    if (!hit) return api.miss(MISS_PENALTY, at)
    setTargets(ts => ts.filter(t => t.id !== hit.id))
    if (hit.friend) return api.miss(FRIEND_PENALTY, at, 'Zakładnik! −50')
    // Faster reaction scores more: 100 points at once, down to 20. Small and moving targets are worth extra.
    const base = Math.max(20, Math.round(100 - (now - hit.born) / 15))
    const bonus = (hit.vx ? 20 : 0) + (hit.r < 30 ? 30 : 0)
    api.hit(base + bonus, at)
  }

  return (
    <div ref={root} className="core core--aim" onPointerDown={shoot}>
      <div className="range__hills" />
      <div className="range__round">{ROUNDS[round]}</div>
      {targets.map(t => (
        <div key={t.id} className={`range__target${t.friend ? ' range__target--friend' : ''}`}
          style={{ left: t.x, top: t.y, width: t.r * 2, height: t.r * 2, margin: `${-t.r}px 0 0 ${-t.r}px` }}>
          {t.friend && <span>🙋</span>}
        </div>
      ))}
      {holes.map(h => <div key={h.id} className="range__hole" style={{ left: h.x, top: h.y }} />)}
    </div>
  )
}
