import { useEffect, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'
import { Leaderboard } from '../components/Leaderboard'
import { haptic } from '../lib/telegram'

const DURATION = 30
const HEIGHT = 300
const HIT_RADIUS = 28
const FRIEND_PENALTY = 50
const MISS_PENALTY = 5

interface Target { id: number; x: number; y: number; friend: boolean; born: number; until: number }
interface Mark { id: number; x: number; y: number; text?: string; bad?: boolean }

export function RangeGame({ onDone }: ToyProps) {
  const [phase, setPhase] = useState<'idle' | 'play' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const [targets, setTargets] = useState<Target[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [flash, setFlash] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (phase !== 'play') return
    const started = Date.now()
    let nextSpawn = started + 500
    const iv = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - started) / 1000
      const l = Math.max(0, DURATION - Math.floor(elapsed))
      setLeft(l)
      if (l === 0) {
        setTargets([])
        setPhase('over')
        doneRef.current()
        return
      }
      // Targets come faster and stay up shorter as the clock runs down.
      const pace = 1 + elapsed / DURATION
      // State updaters MUST stay pure (StrictMode runs them twice), so the spawn is decided here.
      let spawned: Target | null = null
      if (now >= nextSpawn) {
        nextSpawn = now + (700 + Math.random() * 400) / pace
        const w = stage.current?.clientWidth ?? 320
        spawned = {
          id: now,
          x: 36 + Math.random() * (w - 72),
          y: 70 + Math.random() * (HEIGHT - 120),
          friend: Math.random() < 0.25,
          born: now,
          until: now + 1500 / pace,
        }
      }
      setTargets(prev => {
        const alive = prev.filter(t => t.until > now)
        return spawned ? [...alive, spawned] : alive
      })
    }, 50)
    return () => clearInterval(iv)
  }, [phase])

  const shoot = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'play' || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const now = Date.now()
    const hit = targets.find(t => Math.hypot(t.x - x, t.y - y) < HIT_RADIUS)
    let delta: number
    let text: string
    if (!hit) {
      delta = -MISS_PENALTY
      text = `−${MISS_PENALTY}`
    } else if (hit.friend) {
      delta = -FRIEND_PENALTY
      text = 'Swój! −50'
      setFlash(now)
    } else {
      // Faster reaction scores more: 100 points at once, down to 20.
      delta = Math.max(20, Math.round(100 - (now - hit.born) / 15))
      text = `+${delta}`
    }
    if (hit) haptic.tap()
    if (hit) setTargets(ts => ts.filter(t => t.id !== hit.id))
    setScore(s => Math.max(0, s + delta))
    setMarks(m => [...m.slice(-8), { id: now, x, y, text, bad: delta < 0 }])
  }

  const start = () => {
    setScore(0)
    setLeft(DURATION)
    setTargets([])
    setMarks([])
    setPhase('play')
  }

  return (
    <div className="game">
      <Stage stageRef={stage} height={HEIGHT} onClick={shoot} style={{ cursor: phase === 'play' ? 'crosshair' : 'default' }}
        background="linear-gradient(#9cc9e6 0 22%, #c7b37f 22% 30%, #d9c89a 30%)">
        <div className="hud">
          <span>🎯 {score}</span>
          <span className="hud__time" data-low={(phase === 'play' && left <= 5) || undefined}>{left}s</span>
        </div>
        <div className="hud__bar" style={{ transform: `scaleX(${left / DURATION})` }} />
        {targets.map(t => (
          <div key={t.id} className={`range__target${t.friend ? ' range__target--friend' : ''}`} style={{ left: t.x, top: t.y }}>
            {t.friend && <span>🙋</span>}
          </div>
        ))}
        {marks.map(m => (
          <div key={m.id}>
            <div className="range__hole" style={{ left: m.x, top: m.y }} />
            {m.text && <span className="popup" data-bad={m.bad || undefined} style={{ left: m.x, top: m.y }}>{m.text}</span>}
          </div>
        ))}
        {flash > 0 && <div key={flash} className="range__flash" />}
        {phase !== 'play' && (
          <div className="stage__overlay">
            {phase === 'over' && <p className="stage__big">{score} pkt</p>}
            <p>{phase === 'idle'
              ? 'Trening refleksu jak w Caliber 3. Trafiaj czerwone tarcze, im szybciej, tym więcej punktów. Niebieskich „swoich” 🙋 NIE ruszaj: −50!'
              : 'Instruktorzy Caliber 3 mówią, że najważniejsze jest nie to, jak szybko strzelasz, ale czy wiesz, kiedy NIE strzelać.'}</p>
            <button className="btn" onClick={e => { e.stopPropagation(); start() }}>{phase === 'idle' ? 'Start' : 'Jeszcze raz'}</button>
          </div>
        )}
      </Stage>
      <Leaderboard game="range" pendingScore={phase === 'over' ? score : null} unit="pkt" />
    </div>
  )
}
