import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const FISH = 14
const NET_RADIUS = 60
const STORM = [0.45, 0.65] as const
const STORM_SPEED = 1.7
const TIME_FISH_SECONDS = 3
const PETER = 153

type Kind = 'fish' | 'gold' | 'time'
interface Fish { x: number; y: number; v: number; kind: Kind }

const POINTS: Record<Kind, number> = { fish: 1, gold: 5, time: 1 }

export function FishingCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const fish = useRef<Fish[]>([])
  const nodes = useRef<(HTMLDivElement | null)[]>([])
  const spawnRef = useRef<(edge: boolean) => Fish>(() => ({ x: 0, y: 0, v: 1, kind: 'fish' }))
  const total = useRef(0)
  const [storm, setStorm] = useState(false)

  useEffect(() => {
    const el = root.current!
    const w = el.clientWidth
    const h = el.clientHeight
    const spawn = (edge: boolean): Fish => {
      const v = (Math.random() * 0.9 + 0.5) * (Math.random() < 0.5 ? -1 : 1)
      const r = Math.random()
      const kind: Kind = r < 0.04 ? 'time' : r < 0.16 ? 'gold' : 'fish'
      return { x: edge ? (v > 0 ? -30 : w + 30) : Math.random() * w, y: 30 + Math.random() * (h - 80), v, kind }
    }
    spawnRef.current = spawn
    fish.current = Array.from({ length: FISH }, () => spawn(false))
    let stormOn = false
    let raf = 0
    const tick = () => {
      const p = api.progress()
      // Halfway through, a storm hits the lake like in Mark 4, then Jesus calms it.
      const inStorm = p >= STORM[0] && p < STORM[1]
      if (inStorm !== stormOn) {
        stormOn = inStorm
        setStorm(inStorm)
        api.announce(inStorm ? 'Burza na jeziorze!' : '„Ucisz się, umilknij!” (Mk 4,39)')
      }
      const speed = (1 + p) * (inStorm ? STORM_SPEED : 1)
      fish.current.forEach((f, i) => {
        f.x += f.v * speed
        if (f.x < -40 || f.x > w + 40) fish.current[i] = spawn(true)
        const g = fish.current[i]
        const n = nodes.current[i]
        if (n) {
          n.textContent = g.kind === 'gold' ? '🐠' : '🐟'
          n.dataset.kind = g.kind
          const sway = inStorm ? Math.sin(g.x / 12) * 14 : Math.sin(g.x / 20) * 5
          n.style.transform = `translate(${g.x}px,${g.y + sway}px) scaleX(${g.v > 0 ? -1 : 1})`
        }
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [api])

  const cast = (e: React.PointerEvent<HTMLDivElement>) => {
    const at = pointIn(e)
    const net = document.createElement('div')
    net.className = 'net'
    net.style.left = `${at.x - NET_RADIUS}px`
    net.style.top = `${at.y - NET_RADIUS}px`
    root.current!.appendChild(net)
    net.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600 }).onfinish = () => net.remove()

    let got = 0
    let clock = false
    fish.current.forEach((f, i) => {
      if (Math.hypot(f.x + 14 - at.x, f.y + 14 - at.y) < NET_RADIUS) {
        got += POINTS[f.kind]
        if (f.kind === 'time') clock = true
        fish.current[i] = spawnRef.current(true)
      }
    })
    // An empty cast costs a fish so spamming taps does not pay.
    if (!got) return api.miss(1, at)
    const before = total.current
    total.current += api.hit(got, at)
    if (clock) api.addTime(TIME_FISH_SECONDS)
    if (before < PETER && total.current >= PETER) api.announce('153! Jak u Piotra! (J 21,11)')
  }

  return (
    <div ref={root} className={`core core--tap fishing${storm ? ' fishing--storm' : ''}`} onPointerDown={cast}>
      <div className="fishing__boat">⛵</div>
      {storm && <div className="fishing__rain" />}
      {Array.from({ length: FISH }, (_, i) => <div key={i} ref={el => { nodes.current[i] = el }} className="sprite fish" />)}
    </div>
  )
}
