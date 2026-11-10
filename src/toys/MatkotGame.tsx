import { useEffect, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'
import { Leaderboard } from '../components/Leaderboard'

const TOP = 34
const BOTTOM = 196
/** Ball progress from which a tap counts as a hit (1 = at the player's paddle). */
const HIT_FROM = 0.78
const MISS_AT = 1.12

interface Ball { p: number; dir: 1 | -1; v: number; x0: number; x1: number }

const CHEERS = ['Plask!', 'Tak!', 'Yalla!', 'Sababa!', 'Ale odbicie!']

export function MatkotGame({ onDone }: ToyProps) {
  const [phase, setPhase] = useState<'idle' | 'play' | 'over'>('idle')
  const [hits, setHits] = useState(0)
  const [reason, setReason] = useState('')
  const [popup, setPopup] = useState<{ text: string; id: number } | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const ballEl = useRef<HTMLDivElement>(null)
  const shadowEl = useRef<HTMLDivElement>(null)
  const paddleEl = useRef<HTMLDivElement>(null)
  const ball = useRef<Ball>({ p: 0, dir: 1, v: 0.012, x0: 0.5, x1: 0.5 })
  const hitsRef = useRef(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  const end = (why: string) => {
    setReason(why)
    setPhase('over')
    if (hitsRef.current > 0) doneRef.current()
  }

  useEffect(() => {
    if (phase !== 'play') return
    const w = stage.current?.clientWidth ?? 320
    let raf = 0
    const tick = () => {
      const b = ball.current
      b.p += b.dir * b.v
      if (b.dir < 0 && b.p <= 0) {
        // The opponent always returns the ball, aimed somewhere new.
        b.p = 0
        b.dir = 1
        b.x0 = b.x1
        b.x1 = 0.15 + Math.random() * 0.7
      }
      if (b.dir > 0 && b.p > MISS_AT) return end('Piłka w piasku!')
      const x = (b.dir > 0 ? b.x0 + (b.x1 - b.x0) * b.p : b.x1 + (b.x0 - b.x1) * (1 - b.p)) * w
      const y = TOP + b.p * (BOTTOM - TOP)
      const arc = Math.sin(Math.min(1, b.p) * Math.PI) * 40
      if (ballEl.current) ballEl.current.style.transform = `translate(${x - 9}px,${y - 9 - arc}px)`
      if (shadowEl.current) shadowEl.current.style.transform = `translate(${x - 10}px,${y + 6}px) scale(${1 - arc / 80})`
      if (paddleEl.current) paddleEl.current.style.transform = `translate(${b.x1 * w - 22}px,${BOTTOM - 10}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  const tap = () => {
    if (phase !== 'play') return
    const b = ball.current
    if (b.dir < 0) return
    if (b.p < HIT_FROM) return end('Za wcześnie! Machnąłeś w powietrze.')
    b.dir = -1
    b.v *= 1.06
    hitsRef.current += 1
    setHits(hitsRef.current)
    setPopup({ text: CHEERS[hitsRef.current % CHEERS.length], id: Date.now() })
    paddleEl.current?.animate([{ rotate: '0deg' }, { rotate: '-35deg' }, { rotate: '0deg' }], { duration: 180 })
  }

  const start = () => {
    ball.current = { p: 0, dir: 1, v: 0.012, x0: 0.5, x1: 0.5 }
    hitsRef.current = 0
    setHits(0)
    setPhase('play')
  }

  return (
    <div className="game">
      <Stage stageRef={stage} background="linear-gradient(#7cc6dd 0 18%, #f1d9a6 18%)" onClick={tap} style={{ cursor: 'pointer' }}>
        <div className="hud"><span>🏓 {hits}</span></div>
        <div className="matkot__zone" style={{ top: TOP + HIT_FROM * (BOTTOM - TOP) - 8 }} />
        <div className="sprite" style={{ left: '50%', top: 4, fontSize: 30, transform: 'translateX(-50%)' }}>🧔‍♂️</div>
        {phase === 'play' && (
          <>
            <div ref={shadowEl} className="sprite matkot__shadow" />
            <div ref={ballEl} className="sprite matkot__ball" />
            <div ref={paddleEl} className="sprite matkot__paddle" />
          </>
        )}
        {popup && phase === 'play' && <div key={popup.id} className="popup" style={{ left: '50%', top: '45%' }}>{popup.text}</div>}
        {phase !== 'play' && (
          <div className="stage__overlay">
            {phase === 'over' && <p className="stage__big">{hits} odbić</p>}
            <p>{phase === 'idle'
              ? 'Matkot to plażowe „ping-pong bez siatki”, w które gra cały Tel Awiw. Stuknij, gdy piłka wpadnie w jasny pas. Za wcześnie albo za późno: koniec.'
              : reason}</p>
            <button className="btn" onClick={e => { e.stopPropagation(); start() }}>{phase === 'idle' ? 'Gramy' : 'Jeszcze raz'}</button>
          </div>
        )}
      </Stage>
      <Leaderboard game="matkot" pendingScore={phase === 'over' ? hits : null} unit="odbić" />
    </div>
  )
}
