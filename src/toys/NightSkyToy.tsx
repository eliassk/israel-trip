import { useMemo, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'

export function NightSkyToy({ onDone }: ToyProps) {
  const [lights, setLights] = useState(100)
  const [meteors, setMeteors] = useState<{ x: number; y: number; id: number }[]>([])
  const stage = useRef<HTMLDivElement>(null)
  const stars = useMemo(() => Array.from({ length: 140 }, () => ({ x: Math.random() * 100, y: Math.random() * 80, z: Math.random() * 2 + 1, o: 0.3 + Math.random() * 0.7 })), [])
  const dark = 1 - lights / 100
  const done = lights === 0

  const change = (v: number) => {
    setLights(v)
    if (v === 0 && !done) onDone()
  }
  const meteor = (e: React.MouseEvent) => {
    if (!done || (e.target as HTMLElement).tagName === 'INPUT' || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    const m = { x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() }
    setMeteors(ms => [...ms.slice(-4), m])
  }

  return (
    <Stage stageRef={stage} background="#070b17" onClick={meteor}
      message={done ? '„Spójrz na niebo i policz gwiazdy” (Rdz 15,5). Stuknij niebo!' : 'Przesuń suwak w lewo: wyłączamy miasto'}>
      <div className="milkyway" style={{ opacity: dark * dark }} />
      {stars.map((s, i) => (
        <div key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.z, height: s.z, opacity: Math.max(0, dark * 1.4 - 0.4) * s.o }} />
      ))}
      <div className="city-glow" style={{ opacity: 1 - dark }} />
      <div className="skyline" style={{ opacity: 1 - dark * 0.9 }}>🏙️🏢🏙️🏬🏢🏙️🏢🏬🏙️🏢🏙️🏬</div>
      {meteors.map(m => <div key={m.id} className="meteor" style={{ left: m.x, top: m.y }} />)}
      <input id="sky-lights" type="range" min={0} max={100} value={lights} onChange={e => change(+e.target.value)} aria-label="Światła miasta" className="stage__range" />
    </Stage>
  )
}
