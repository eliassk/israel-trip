import { useEffect, useRef } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const FISH = 14
const NET_RADIUS = 60

interface Fish { x: number; y: number; v: number; gold: boolean }

export function FishingCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const fish = useRef<Fish[]>([])
  const nodes = useRef<(HTMLDivElement | null)[]>([])
  const spawnRef = useRef<(edge: boolean) => Fish>(() => ({ x: 0, y: 0, v: 1, gold: false }))

  useEffect(() => {
    const el = root.current!
    const w = el.clientWidth
    const h = el.clientHeight
    const spawn = (edge: boolean): Fish => {
      const v = (Math.random() * 0.9 + 0.5) * (Math.random() < 0.5 ? -1 : 1)
      return { x: edge ? (v > 0 ? -30 : w + 30) : Math.random() * w, y: 30 + Math.random() * (h - 80), v, gold: Math.random() < 0.12 }
    }
    spawnRef.current = spawn
    fish.current = Array.from({ length: FISH }, () => spawn(false))
    let raf = 0
    const tick = () => {
      // Fish swim up to twice as fast by the end of the round.
      const speed = 1 + api.progress()
      fish.current.forEach((f, i) => {
        f.x += f.v * speed
        if (f.x < -40 || f.x > w + 40) fish.current[i] = spawn(true)
        const g = fish.current[i]
        const n = nodes.current[i]
        if (n) {
          n.textContent = g.gold ? '🐠' : '🐟'
          n.style.transform = `translate(${g.x}px,${g.y + Math.sin(g.x / 20) * 5}px) scaleX(${g.v > 0 ? -1 : 1})`
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
    fish.current.forEach((f, i) => {
      if (Math.hypot(f.x + 14 - at.x, f.y + 14 - at.y) < NET_RADIUS) {
        got += f.gold ? 5 : 1
        fish.current[i] = spawnRef.current(true)
      }
    })
    // An empty cast costs a fish so spamming taps does not pay.
    if (got) api.hit(got, at)
    else api.miss(1, at)
  }

  return (
    <div ref={root} className="core core--tap" onPointerDown={cast}>
      {Array.from({ length: FISH }, (_, i) => <div key={i} ref={el => { nodes.current[i] = el }} className="sprite fish" />)}
    </div>
  )
}
