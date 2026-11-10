import { useRef, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const ML_PER_TAP = 5
const JAR_ML = 700

export function OlivePressCore({ api }: CoreProps) {
  const [ml, setMl] = useState(0)
  const stone = useRef<HTMLDivElement>(null)
  const angle = useRef(0)

  const press = (e: React.PointerEvent<HTMLDivElement>) => {
    const at = pointIn(e)
    setMl(v => v + ML_PER_TAP)
    angle.current += 24
    if (stone.current) stone.current.style.transform = `rotate(${angle.current}deg)`
    api.hit(ML_PER_TAP, at, '+5')
  }

  return (
    <div className="core core--tap" onPointerDown={press}>
      <div className="press__basin" />
      <div ref={stone} className="press__stone" />
      <div className="press__jar"><div className="press__oil" style={{ height: `${Math.min(1, ml / JAR_ML) * 100}%` }} /></div>
      <p className="press__hint">Stukaj jak najszybciej!</p>
    </div>
  )
}
