import { useEffect, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'
import { Leaderboard } from '../components/Leaderboard'

const DURATION = 10
const ML_PER_TAP = 5
const JAR_ML = 500

export function OlivePressGame({ onDone }: ToyProps) {
  const [phase, setPhase] = useState<'idle' | 'play' | 'over'>('idle')
  const [ml, setMl] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const stone = useRef<HTMLDivElement>(null)
  const angle = useRef(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (phase !== 'play') return
    const started = Date.now()
    const iv = setInterval(() => {
      const l = Math.max(0, DURATION - Math.floor((Date.now() - started) / 1000))
      setLeft(l)
      if (l === 0) {
        setPhase('over')
        doneRef.current()
      }
    }, 100)
    return () => clearInterval(iv)
  }, [phase])

  const press = () => {
    if (phase !== 'play') return
    setMl(v => v + ML_PER_TAP)
    angle.current += 24
    if (stone.current) stone.current.style.transform = `rotate(${angle.current}deg)`
  }

  const start = () => {
    setMl(0)
    setLeft(DURATION)
    setPhase('play')
  }

  const fill = Math.min(1, ml / JAR_ML)
  return (
    <div className="game">
      <Stage background="linear-gradient(#cfe3c0, #9db57f)" onClick={press} style={{ cursor: 'pointer' }}>
        <div className="hud"><span>🫒 {ml} ml</span><span className="hud__time" data-low={(phase === 'play' && left <= 3) || undefined}>{left}s</span></div>
        <div className="press__basin" />
        <div ref={stone} className="press__stone" />
        <div className="press__jar"><div className="press__oil" style={{ height: `${fill * 100}%` }} /></div>
        {phase !== 'play' && (
          <div className="stage__overlay">
            {phase === 'over' && <p className="stage__big">{ml} ml oliwy</p>}
            <p>{phase === 'idle'
              ? 'Getsemani to „tłocznia oliwy”. Stukaj jak najszybciej, żeby kręcić kamieniem. Masz 10 sekund.'
              : 'Z jednego drzewa oliwnego zbiera się rocznie kilkanaście litrów oliwy.'}</p>
            <button className="btn" onClick={e => { e.stopPropagation(); start() }}>{phase === 'idle' ? 'Tłoczymy' : 'Jeszcze raz'}</button>
          </div>
        )}
      </Stage>
      <Leaderboard game="olivepress" pendingScore={phase === 'over' ? ml : null} unit="ml" />
    </div>
  )
}
