import { useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'

const caption = (v: number) =>
  v < 6 ? 'Zwykłe morze. Machaj rękami! 🫧'
  : v < 20 ? 'Coraz łatwiej się unosić…'
  : v < 30 ? 'Prawie leżysz na wodzie'
  : 'Morze Martwe! Leżysz jak na materacu i czytasz gazetę'

export function SaltwaterToy({ onDone }: ToyProps) {
  const [salt, setSalt] = useState(3)
  const [done, setDone] = useState(false)
  const t = (salt - 1) / 33

  const change = (v: number) => {
    setSalt(v)
    if (v >= 30 && !done) {
      setDone(true)
      onDone()
    }
  }

  return (
    <Stage background="linear-gradient(#f3d9a4 0 38%, #3b8fb0 38%)" message={`Sól: ${salt}% · ${caption(salt)}`}>
      <input id="salt" type="range" min={1} max={34} value={salt} onChange={e => change(+e.target.value)} aria-label="Zasolenie" className="stage__range" />
      <div className="sprite bob" style={{ left: '42%', top: 170 - t * 90, fontSize: 48, transform: `rotate(${-t * 80}deg)`, transition: 'top .3s, transform .3s' }}>🧑</div>
      <div className="sprite" style={{ left: '58%', top: 150 - t * 90, fontSize: 28, opacity: t > 0.85 ? 1 : 0, transition: 'opacity .3s, top .3s' }}>📰</div>
    </Stage>
  )
}
