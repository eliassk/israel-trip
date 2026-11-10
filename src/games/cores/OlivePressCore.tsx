import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const BEAT_MS = 650
/** How far from the beat a tap still counts as in rhythm. */
const WINDOW_MS = 140
const ON_BEAT_ML = 10
const JAR_ML = 250

export function OlivePressCore({ api }: CoreProps) {
  const [ml, setMl] = useState(0)
  const [beat, setBeat] = useState(0)
  const stone = useRef<HTMLDivElement>(null)
  const angle = useRef(0)
  const t0 = useRef(performance.now())
  const lastBeatTapped = useRef(-1)

  useEffect(() => {
    t0.current = performance.now()
    const iv = setInterval(() => setBeat(Math.floor((performance.now() - t0.current) / BEAT_MS)), 40)
    return () => clearInterval(iv)
  }, [])

  // Tap when the ring closes on the stone, like pushing a real millstone in rhythm.
  const press = (e: React.PointerEvent<HTMLDivElement>) => {
    const at = pointIn(e)
    const t = performance.now() - t0.current
    const nearest = Math.round(t / BEAT_MS)
    const off = Math.abs(t - nearest * BEAT_MS)
    if (off > WINDOW_MS || nearest === lastBeatTapped.current) {
      api.miss(0, at, 'Poza rytmem')
      return
    }
    lastBeatTapped.current = nearest
    angle.current += 40
    if (stone.current) stone.current.style.transform = `rotate(${angle.current}deg)`
    setMl(v => v + ON_BEAT_ML)
    api.hit(ON_BEAT_ML, at, off < WINDOW_MS / 3 ? 'Idealnie!' : undefined)
  }

  return (
    <div className="core core--tap" onPointerDown={press}>
      <div className="press__basin" />
      <div ref={stone} className="press__stone" />
      <div key={beat} className="press__ring" style={{ animationDuration: `${BEAT_MS}ms` }} />
      <div className="press__jar"><div className="press__oil" style={{ height: `${Math.min(1, ml / JAR_ML) * 100}%` }} /></div>
      <p className="press__hint">Stuknij, gdy pierścień dotknie kamienia</p>
    </div>
  )
}
