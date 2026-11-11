import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const FISH = 14
const NET_RADIUS = 80
const TIME_FISH_SECONDS = 3
const STORM = [0.5, 0.62] as const
/** Chance of a lightning strike per frame during the storm. */
const LIGHTNING = 0.025
const STORM_SPEED = 1.7
const PETER = 153
/** Time to haul the net back in before the next cast, in ms. */
const COOLDOWN = 700

// Fixed positions so the scenery does not jump on re-render.
const BUBBLES = [8, 19, 33, 47, 58, 71, 84, 93].map((x, i) => ({ x, delay: i * 0.9, dur: 5 + (i % 3) * 1.5 }))
const WEEDS = [4, 13, 27, 62, 78, 90]

/** Shore, waves, light, weed and bubbles. Purely decorative and behind the fish. */
function Lake() {
  return (
    <div className="lake" aria-hidden="true">
      <svg className="lake__shore" viewBox="0 0 400 40" preserveAspectRatio="none">
        <path d="M0 40 V22 Q40 6 90 18 T190 12 T290 20 T400 10 V40 Z" fill="#6f8f6a" opacity=".55" />
        <path d="M0 40 V30 Q60 18 130 28 T260 24 T400 26 V40 Z" fill="#4f7a5e" opacity=".7" />
      </svg>
      <div className="lake__rays" />
      <div className="lake__waves lake__waves--a" />
      <div className="lake__waves lake__waves--b" />
      {WEEDS.map((x, i) => (
        <svg key={x} className="lake__weed" style={{ left: `${x}%`, animationDelay: `${-i * 0.7}s`, height: 60 + (i % 3) * 22 }} viewBox="0 0 30 100" preserveAspectRatio="none">
          <path d="M15 100 Q4 75 14 55 T12 10 M15 100 Q26 80 18 60 T22 22" stroke="#2f7a5a" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      ))}
      {BUBBLES.map(b => <span key={b.x} className="lake__bubble" style={{ left: `${b.x}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }} />)}
    </div>
  )
}

type Kind = 'fish' | 'puffer' | 'gold' | 'time'
interface Fish { x: number; y: number; v: number; kind: Kind }

const POINTS: Record<Kind, number> = { fish: 1, puffer: 2, gold: 5, time: 1 }
const LOOK: Record<Kind, string> = { fish: '🐟', puffer: '🐡', gold: '🐠', time: '🐟' }

export function FishingCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const fish = useRef<Fish[]>([])
  const nodes = useRef<(HTMLDivElement | null)[]>([])
  const spawnRef = useRef<(edge: boolean) => Fish>(() => ({ x: 0, y: 0, v: 1, kind: 'fish' }))
  const total = useRef(0)
  const [storm, setStorm] = useState(false)
  const [bolt, setBolt] = useState<{ n: number; x: number } | null>(null)
  const lastCast = useRef(-COOLDOWN)
  const [casts, setCasts] = useState(0)

  useEffect(() => {
    const el = root.current!
    const w = el.clientWidth
    const h = el.clientHeight
    const spawn = (edge: boolean): Fish => {
      const v = (Math.random() * 0.9 + 0.5) * (Math.random() < 0.5 ? -1 : 1)
      const r = Math.random()
      const kind: Kind = r < 0.04 ? 'time' : r < 0.14 ? 'gold' : r < 0.36 ? 'puffer' : 'fish'
      return { x: edge ? (v > 0 ? -30 : w + 30) : Math.random() * w, y: 30 + Math.random() * (h - 80), v, kind }
    }
    spawnRef.current = spawn
    fish.current = Array.from({ length: FISH }, () => spawn(false))
    let stormOn = false
    let raf = 0
    const tick = () => {
      const p = api.progress()
      // Halfway through, a storm hits the lake like in Mark 4, then calms down.
      const inStorm = p >= STORM[0] && p < STORM[1]
      if (inStorm !== stormOn) {
        stormOn = inStorm
        setStorm(inStorm)
        if (inStorm) api.announce('Burza na jeziorze!')
      }
      if (inStorm && Math.random() < LIGHTNING) setBolt(b => ({ n: (b?.n ?? 0) + 1, x: 0.15 + Math.random() * 0.7 }))
      const speed = (1 + p) * (inStorm ? STORM_SPEED : 1)
      fish.current.forEach((f, i) => {
        f.x += f.v * speed
        if (f.x < -40 || f.x > w + 40) fish.current[i] = spawn(true)
        const g = fish.current[i]
        const n = nodes.current[i]
        if (n) {
          n.textContent = LOOK[g.kind]
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
    if (e.timeStamp - lastCast.current < COOLDOWN) return
    lastCast.current = e.timeStamp
    setCasts(c => c + 1)
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
      if (Math.hypot(f.x + 19 - at.x, f.y + 19 - at.y) < NET_RADIUS) {
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
      <Lake />
      <div className="fishing__boat">⛵</div>
      {storm && <div className="fishing__rain" />}
      {storm && bolt && (
        <div key={bolt.n} className="fishing__flash">
          <svg className="fishing__bolt" style={{ left: `${bolt.x * 100}%` }} viewBox="0 0 40 120" aria-hidden="true">
            <path d="M24 0 L8 54 H20 L10 120 L34 44 H22 L32 0 Z" fill="#fff8d0" />
          </svg>
        </div>
      )}
      {casts > 0 && <div key={casts} className="fishing__haul" style={{ animationDuration: `${COOLDOWN}ms` }} />}
      {Array.from({ length: FISH }, (_, i) => <div key={i} ref={el => { nodes.current[i] = el }} className="sprite fish" />)}
    </div>
  )
}
