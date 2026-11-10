import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const HIT_RADIUS = 32
const FRIEND_PENALTY = 50
const MISS_PENALTY = 5

interface Target { id: number; x: number; y: number; friend: boolean; born: number; until: number }

export function RangeCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const [targets, setTargets] = useState<Target[]>([])
  const [holes, setHoles] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    let nextSpawn = Date.now() + 300
    const iv = setInterval(() => {
      const now = Date.now()
      // Targets come faster and stay up shorter as the clock runs down.
      const pace = 1 + api.progress()
      // State updaters MUST stay pure (StrictMode runs them twice), so the spawn is decided here.
      let spawned: Target | null = null
      if (now >= nextSpawn) {
        nextSpawn = now + (650 + Math.random() * 400) / pace
        const el = root.current!
        spawned = {
          id: now,
          x: 40 + Math.random() * (el.clientWidth - 80),
          y: 90 + Math.random() * (el.clientHeight - 150),
          friend: Math.random() < 0.25,
          born: now,
          until: now + 1500 / pace,
        }
      }
      setTargets(prev => {
        const alive = prev.filter(t => t.until > now)
        return spawned ? [...alive, spawned] : alive
      })
    }, 50)
    return () => clearInterval(iv)
  }, [api])

  const shoot = (e: React.PointerEvent<HTMLDivElement>) => {
    const at = pointIn(e)
    const now = Date.now()
    setHoles(h => [...h.slice(-12), { id: now, ...at }])
    const hit = targets.find(t => Math.hypot(t.x - at.x, t.y - at.y) < HIT_RADIUS)
    if (!hit) return api.miss(MISS_PENALTY, at)
    setTargets(ts => ts.filter(t => t.id !== hit.id))
    if (hit.friend) return api.miss(FRIEND_PENALTY, at, 'Swój! −50')
    // Faster reaction scores more: 100 points at once, down to 20.
    api.hit(Math.max(20, Math.round(100 - (now - hit.born) / 15)), at)
  }

  return (
    <div ref={root} className="core core--aim" onPointerDown={shoot}>
      <div className="range__hills" />
      {targets.map(t => (
        <div key={t.id} className={`range__target${t.friend ? ' range__target--friend' : ''}`} style={{ left: t.x, top: t.y }}>
          {t.friend && <span>🙋</span>}
        </div>
      ))}
      {holes.map(h => <div key={h.id} className="range__hole" style={{ left: h.x, top: h.y }} />)}
    </div>
  )
}
