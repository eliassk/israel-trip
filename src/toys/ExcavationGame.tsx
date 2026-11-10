import { useEffect, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'
import { Leaderboard } from '../components/Leaderboard'

const DURATION = 30
const HOLES = 9

interface Find { emoji: string; name: string; points: number }

const FINDS: Find[] = [
  { emoji: '🏺', name: 'dzban', points: 1 },
  { emoji: '🪙', name: 'moneta', points: 2 },
  { emoji: '🏹', name: 'grot strzały', points: 2 },
  { emoji: '📜', name: 'zwój', points: 5 },
  { emoji: '👑', name: 'pieczęć króla', points: 10 },
  { emoji: '🥤', name: 'kubek turysty', points: -3 },
  { emoji: '🩴', name: 'klapek turysty', points: -3 },
]
// Rare finds MUST stay rare, junk SHOULD show up often enough to punish blind tapping.
const WEIGHTS = [30, 20, 15, 6, 2, 14, 13]

const pick = (): Find => {
  let r = Math.random() * WEIGHTS.reduce((a, b) => a + b)
  for (let i = 0; i < FINDS.length; i++) if ((r -= WEIGHTS[i]) < 0) return FINDS[i]
  return FINDS[0]
}

type Slot = { find: Find; until: number; id: number } | null

export function ExcavationGame({ onDone }: ToyProps) {
  const [phase, setPhase] = useState<'idle' | 'play' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const [slots, setSlots] = useState<Slot[]>(() => Array(HOLES).fill(null))
  const [popups, setPopups] = useState<{ hole: number; text: string; bad: boolean; id: number }[]>([])
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (phase !== 'play') return
    const started = Date.now()
    const iv = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - started) / 1000
      const l = Math.max(0, DURATION - Math.floor(elapsed))
      setLeft(l)
      if (l === 0) {
        setPhase('over')
        setSlots(Array(HOLES).fill(null))
        doneRef.current()
        return
      }
      // Finds pop up faster and stay shorter as time runs out.
      const pace = 1 + elapsed / DURATION
      setSlots(prev => {
        const next = prev.map(s => (s && s.until < now ? null : s))
        if (Math.random() < 0.35 * pace) {
          const free = next.flatMap((s, i) => (s ? [] : [i]))
          if (free.length) {
            const hole = free[Math.floor(Math.random() * free.length)]
            next[hole] = { find: pick(), until: now + 1400 / pace, id: now }
          }
        }
        return next
      })
    }, 120)
    return () => clearInterval(iv)
  }, [phase])

  const dig = (hole: number) => {
    if (phase !== 'play') return
    const s = slots[hole]
    if (!s) return
    setScore(v => Math.max(0, v + s.find.points))
    setSlots(prev => prev.map((x, i) => (i === hole ? null : x)))
    const text = `${s.find.points > 0 ? '+' : ''}${s.find.points} ${s.find.name}`
    setPopups(p => [...p.slice(-3), { hole, text, bad: s.find.points < 0, id: Date.now() }])
  }

  const start = () => {
    setScore(0)
    setLeft(DURATION)
    setSlots(Array(HOLES).fill(null))
    setPopups([])
    setPhase('play')
  }

  return (
    <div className="game">
      <Stage background="#8a6a43" height={300}>
        <div className="hud">
          <span>⛏️ {score}</span>
          <span className="hud__time" data-low={(phase === 'play' && left <= 5) || undefined}>{left}s</span>
        </div>
        <div className="hud__bar" style={{ transform: `scaleX(${left / DURATION})` }} />
        <div className="dig">
          {slots.map((s, i) => (
            <button key={i} className="dig__hole" onClick={() => dig(i)} aria-label={s ? s.find.name : 'Pusty wykop'}>
              {s && <span key={s.id} className="dig__find">{s.find.emoji}</span>}
              {popups.filter(p => p.hole === i).map(p => (
                <span key={p.id} className="popup dig__popup" data-bad={p.bad || undefined}>{p.text}</span>
              ))}
            </button>
          ))}
        </div>
        {phase !== 'play' && (
          <div className="stage__overlay">
            {phase === 'over' && <p className="stage__big">{score} pkt</p>}
            <p>{phase === 'idle'
              ? 'Jesteś archeologiem w Megiddo. Łap znaleziska, zanim znikną: 🏺 1, 🪙🏹 2, 📜 5, 👑 10. Śmieci turystów 🥤🩴 to −3!'
              : 'W Megiddo naprawdę znaleziono pieczęć sługi króla Jeroboama.'}</p>
            <button className="btn" onClick={start}>{phase === 'idle' ? 'Kopiemy' : 'Jeszcze raz'}</button>
          </div>
        )}
      </Stage>
      <Leaderboard game="excavation" pendingScore={phase === 'over' ? score : null} unit="pkt" />
    </div>
  )
}
