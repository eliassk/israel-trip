import { useEffect, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'
import { Leaderboard } from '../components/Leaderboard'

const DURATION = 30
const FISH_COUNT = 14
const NET_RADIUS = 58

interface Fish { x: number; y: number; v: number; gold: boolean }

const spawn = (w: number, fromEdge: boolean): Fish => {
  const v = (Math.random() * 0.9 + 0.5) * (Math.random() < 0.5 ? -1 : 1)
  return { x: fromEdge ? (v > 0 ? -30 : w + 30) : Math.random() * w, y: 20 + Math.random() * 170, v, gold: Math.random() < 0.12 }
}

export function FishingGame({ onDone }: ToyProps) {
  const [phase, setPhase] = useState<'idle' | 'play' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const [popup, setPopup] = useState<{ x: number; y: number; text: string; id: number } | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const fish = useRef<Fish[]>([])
  const nodes = useRef<(HTMLDivElement | null)[]>([])
  const leftRef = useRef(DURATION)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (phase !== 'play') return
    const w = stage.current?.clientWidth ?? 320
    fish.current = Array.from({ length: FISH_COUNT }, () => spawn(w, false))
    let raf = 0
    const speedUp = () => 1 + (DURATION - leftRef.current) / DURATION
    const tick = () => {
      fish.current.forEach((f, i) => {
        f.x += f.v * speedUp()
        if (f.x < -40 || f.x > w + 40) fish.current[i] = spawn(w, true)
        const el = nodes.current[i]
        const g = fish.current[i]
        if (el) {
          el.textContent = g.gold ? '🐠' : '🐟'
          el.style.transform = `translate(${g.x}px,${g.y + Math.sin(g.x / 20) * 4}px) scaleX(${g.v > 0 ? -1 : 1})`
        }
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    const started = Date.now()
    const timer = setInterval(() => {
      const l = Math.max(0, DURATION - Math.floor((Date.now() - started) / 1000))
      leftRef.current = l
      setLeft(l)
      if (l === 0) {
        setPhase('over')
        doneRef.current()
      }
    }, 200)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(timer)
    }
  }, [phase])

  const cast = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'play' || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const w = stage.current.clientWidth
    const net = document.createElement('div')
    net.className = 'net'
    net.style.left = `${x - NET_RADIUS}px`
    net.style.top = `${y - NET_RADIUS}px`
    stage.current.appendChild(net)
    net.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600 }).onfinish = () => net.remove()

    let got = 0
    fish.current.forEach((f, i) => {
      if (Math.hypot(f.x + 12 - x, f.y + 12 - y) < NET_RADIUS) {
        got += f.gold ? 5 : 1
        fish.current[i] = spawn(w, true)
      }
    })
    // An empty cast costs a fish so spamming taps does not pay.
    const delta = got || -1
    setScore(s => Math.max(0, s + delta))
    setPopup({ x, y, text: delta > 0 ? `+${delta}` : '−1', id: Date.now() })
  }

  const start = () => {
    setScore(0)
    setLeft(DURATION)
    leftRef.current = DURATION
    setPhase('play')
  }

  return (
    <div className="game">
      <Stage stageRef={stage} background="radial-gradient(circle at 30% 20%, #5fb3cf, #1d6a8a)" onClick={cast} style={{ cursor: phase === 'play' ? 'crosshair' : 'default' }}>
        <div className="hud">
          <span>🐟 {score}</span>
          <span className="hud__time" data-low={left <= 5 || undefined}>{left}s</span>
        </div>
        <div className="hud__bar" style={{ transform: `scaleX(${left / DURATION})` }} />
        {phase === 'play' && Array.from({ length: FISH_COUNT }, (_, i) => (
          <div key={i} ref={el => { nodes.current[i] = el }} className="sprite fish" />
        ))}
        {popup && <div key={popup.id} className="popup" style={{ left: popup.x, top: popup.y }} data-bad={popup.text === '−1' || undefined}>{popup.text}</div>}
        {phase !== 'play' && (
          <div className="stage__overlay">
            {phase === 'over' && <p className="stage__big">{score} ryb!</p>}
            <p>{phase === 'idle' ? '🐟 = 1 pkt, 🐠 = 5 pkt. Puste zarzucenie: −1.' : 'Piotr złowił 153 (J 21,11). Dasz radę?'}</p>
            <button className="btn" onClick={e => { e.stopPropagation(); start() }}>{phase === 'idle' ? 'Start' : 'Jeszcze raz'}</button>
          </div>
        )}
      </Stage>
      <Leaderboard game="fishing" pendingScore={phase === 'over' ? score : null} unit="ryb" />
    </div>
  )
}
