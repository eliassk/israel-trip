import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameApi, GameDef, Point } from './types'
import { Results } from './Results'
import { isMuted, setMuted, sound } from '../lib/sound'
import { buzz } from '../lib/feedback'
import { recordBest } from '../lib/best'

const SHAKE: Keyframe[] = [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }]
const COMBO_STEP = 5
const MAX_MULTIPLIER = 4

interface Popup { id: number; x: number; y: number; text: string; bad?: boolean }
interface Spark { id: number; x: number; y: number }

interface Props {
  def: GameDef
  onClose: () => void
  onFinished: (score: number) => void
}

let seq = 0

export function GameShell({ def, onClose, onFinished }: Props) {
  const [phase, setPhase] = useState<'countdown' | 'play' | 'result'>('countdown')
  const [count, setCount] = useState(3)
  const [run, setRun] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [left, setLeft] = useState(def.duration ?? 0)
  const [popups, setPopups] = useState<Popup[]>([])
  const [sparks, setSparks] = useState<Spark[]>([])
  const [banner, setBanner] = useState<{ id: number; text: string } | null>(null)
  const [muted, setMute] = useState(isMuted)
  const [record, setRecord] = useState(false)
  const area = useRef<HTMLDivElement>(null)
  const scoreRef = useRef(0)
  const streakRef = useRef(0)
  const startedAt = useRef(0)
  const phaseRef = useRef(phase)
  // Kept in a ref so a new callback from the parent never rebuilds the API and restarts the running game.
  const finishedRef = useRef(onFinished)
  finishedRef.current = onFinished
  phaseRef.current = phase

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // 3, 2, 1, Start!
  useEffect(() => {
    if (phase !== 'countdown') return
    if (count === 0) {
      sound.go()
      const t = setTimeout(() => {
        startedAt.current = Date.now()
        setPhase('play')
      }, 450)
      return () => clearTimeout(t)
    }
    sound.tick()
    const t = setTimeout(() => setCount(c => c - 1), 650)
    return () => clearTimeout(t)
  }, [phase, count])

  const center = (): Point => ({ x: (area.current?.clientWidth ?? 320) / 2, y: (area.current?.clientHeight ?? 400) / 2 })

  const popup = useCallback((text: string, at?: Point, bad?: boolean) => {
    const p = at ?? center()
    setPopups(list => [...list.slice(-6), { id: ++seq, x: p.x, y: p.y, text, bad }])
  }, [])

  const finish = useCallback(() => {
    if (phaseRef.current !== 'play') return
    phaseRef.current = 'result'
    const final = scoreRef.current
    setRecord(recordBest(def.key, final))
    sound.end()
    buzz.success()
    setPhase('result')
    finishedRef.current(final)
  }, [def.key])

  const api: GameApi = useMemo(() => ({
    hit(points, at, label) {
      if (phaseRef.current !== 'play') return 0
      const mult = def.combo ? Math.min(MAX_MULTIPLIER, 1 + Math.floor(streakRef.current / COMBO_STEP)) : 1
      const award = points * mult
      streakRef.current += 1
      scoreRef.current += award
      setStreak(streakRef.current)
      setScore(scoreRef.current)
      popup(label ?? `+${award}`, at)
      const p = at ?? center()
      setSparks(list => [...list.slice(-4), { id: ++seq, x: p.x, y: p.y }])
      sound.hit(streakRef.current)
      buzz.light()
      const next = Math.min(MAX_MULTIPLIER, 1 + Math.floor(streakRef.current / COMBO_STEP))
      if (def.combo && next > mult) {
        setBanner({ id: ++seq, text: `COMBO ×${next}` })
        sound.combo()
      }
      return award
    },
    miss(penalty = 0, at, label) {
      if (phaseRef.current !== 'play') return
      streakRef.current = 0
      scoreRef.current = Math.max(0, scoreRef.current - penalty)
      setStreak(0)
      setScore(scoreRef.current)
      popup(label ?? (penalty ? `−${penalty}` : 'Pudło!'), at, true)
      area.current?.animate(SHAKE, { duration: 280 })
      sound.miss()
      buzz.error()
    },
    say(text, at) {
      popup(text, at)
    },
    finish,
    elapsed: () => (startedAt.current ? (Date.now() - startedAt.current) / 1000 : 0),
    progress: () => (def.duration && startedAt.current ? Math.min(1, (Date.now() - startedAt.current) / 1000 / def.duration) : 0),
  }), [def.combo, def.duration, finish, popup])

  // The shell owns the clock for timed games.
  useEffect(() => {
    if (phase !== 'play' || !def.duration) return
    let lastTick = -1
    const iv = setInterval(() => {
      const l = Math.max(0, def.duration! - (Date.now() - startedAt.current) / 1000)
      setLeft(l)
      const whole = Math.ceil(l)
      if (whole <= 3 && whole > 0 && whole !== lastTick) {
        lastTick = whole
        sound.tick()
      }
      if (l <= 0) finish()
    }, 100)
    return () => clearInterval(iv)
  }, [phase, def.duration, finish, run])

  const again = () => {
    scoreRef.current = 0
    streakRef.current = 0
    setScore(0)
    setStreak(0)
    setLeft(def.duration ?? 0)
    setPopups([])
    setSparks([])
    setBanner(null)
    setRecord(false)
    setCount(3)
    setRun(r => r + 1)
    setPhase('countdown')
  }

  const toggleMute = () => {
    setMuted(!muted)
    setMute(!muted)
  }

  const mult = def.combo ? Math.min(MAX_MULTIPLIER, 1 + Math.floor(streak / COMBO_STEP)) : 1
  const Core = def.Core

  return createPortal(
    <motion.div className="shell" role="dialog" aria-modal="true" aria-label={def.title}
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
      <header className="shell__bar">
        <button className="shell__icon" onClick={onClose} aria-label="Zamknij grę">✕</button>
        <motion.span key={score} className="shell__score" initial={{ scale: 1.25 }} animate={{ scale: 1 }}>
          {score} <small>{def.unit}</small>
        </motion.span>
        {def.combo && mult > 1 && <span className="shell__combo">×{mult}</span>}
        <span className="shell__spacer" />
        {def.duration != null && <span className="shell__time" data-low={(phase === 'play' && left <= 5) || undefined}>{Math.ceil(left)}s</span>}
        <button className="shell__icon" onClick={toggleMute} aria-label={muted ? 'Włącz dźwięk' : 'Wycisz'}>{muted ? '🔇' : '🔊'}</button>
      </header>
      {def.duration != null && <div className="shell__timebar" style={{ transform: `scaleX(${left / def.duration})` }} />}
      {def.combo && <div className="shell__streak" style={{ transform: `scaleX(${(streak % COMBO_STEP) / COMBO_STEP})`, opacity: mult >= MAX_MULTIPLIER ? 0 : 1 }} />}

      <div ref={area} className="shell__area" style={{ background: def.background }}>
        {phase !== 'countdown' && <Core key={run} api={api} />}
        {popups.map(p => (
          <span key={p.id} className="shell__popup" data-bad={p.bad || undefined} style={{ left: p.x, top: p.y }}
            onAnimationEnd={() => setPopups(list => list.filter(x => x.id !== p.id))}>{p.text}</span>
        ))}
        {sparks.map(s => (
          <span key={s.id} className="shell__sparks" style={{ left: s.x, top: s.y }} onAnimationEnd={() => setSparks(list => list.filter(x => x.id !== s.id))}>
            {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--a': `${i * 45}deg` } as React.CSSProperties} />)}
          </span>
        ))}
        <AnimatePresence>
          {banner && (
            <motion.div key={banner.id} className="shell__banner" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
              onAnimationComplete={() => setTimeout(() => setBanner(b => (b?.id === banner.id ? null : b)), 500)}>
              {banner.text}
            </motion.div>
          )}
        </AnimatePresence>
        {phase === 'countdown' && <div className="shell__dim" />}
        <AnimatePresence mode="wait">
          {phase === 'countdown' && (
            <motion.div key={count} className="shell__count" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.18 }}>
              {count > 0 ? count : 'Start!'}
            </motion.div>
          )}
        </AnimatePresence>
        {phase === 'result' && <Results def={def} score={score} record={record} onAgain={again} onClose={onClose} />}
      </div>
    </motion.div>,
    document.body,
  )
}
