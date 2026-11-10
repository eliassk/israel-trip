import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MEDALS, medalFor, type GameDef } from './types'
import { submitScore, type Board } from '../lib/leaderboard'
import { load, save } from '../lib/storage'
import { tgName } from '../lib/telegram'
import { sound } from '../lib/sound'
import { shareChallenge } from '../lib/share'

interface Props { def: GameDef; score: number; record: boolean; onAgain: () => void; onClose: () => void }

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms)
      setV(Math.round(target * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

export function Results({ def, score, record, onAgain, onClose }: Props) {
  const shown = useCountUp(score)
  const medal = medalFor(def, score)
  const [name, setName] = useState(() => tgName ?? load('playerName', ''))
  const [board, setBoard] = useState<Board | null>(null)
  const [busy, setBusy] = useState(false)
  const [shareMsg, setShareMsg] = useState('')
  const autoSaved = useRef(false)

  useEffect(() => {
    if (medal > 0) setTimeout(sound.medal, 900)
  }, [medal])

  const submit = async () => {
    if (!name.trim() || busy || score <= 0) return
    setBusy(true)
    if (!tgName) save('playerName', name.trim())
    setBoard(await submitScore(def.key, name.trim(), score))
    setBusy(false)
  }

  // Inside Telegram the name is known, so the score is saved without asking.
  useEffect(() => {
    if (tgName && !autoSaved.current && score > 0) {
      autoSaved.current = true
      void submit()
    }
  })

  const rank = board?.myId ? board.scores.findIndex(s => s.id === board.myId) : -1
  const above = rank > 0 ? board!.scores[rank - 1] : null

  const challenge = async () => {
    const url = `${location.origin}${location.pathname}#/gry/${def.slug}`
    const r = await shareChallenge(`${def.icon} ${def.title}: mam ${score} ${def.unit}! Pobijesz mnie?`, url)
    setShareMsg(r === 'copied' ? 'Skopiowano link. Wklej go znajomym.' : r === 'failed' ? 'Nie udało się udostępnić.' : '')
  }

  return (
    <motion.div className="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="results__card" initial={{ y: 40, scale: 0.9 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
        <p className="results__title">Koniec!</p>
        <p className="results__score">{shown} <small>{def.unit}</small></p>
        {medal > 0 ? (
          <motion.div className="results__medal" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 12 }}>
            {MEDALS[medal]}
          </motion.div>
        ) : (
          <p className="results__hint">Brąz od {def.medals[0]} {def.unit}. Dasz radę!</p>
        )}
        {record && <p className="results__record">Nowy rekord!</p>}
        <p className="results__outro">{def.outro}</p>

        {score > 0 && !board && !tgName && (
          <form className="results__form" onSubmit={e => { e.preventDefault(); void submit() }}>
            <input id={`result-name-${def.key}`} value={name} onChange={e => setName(e.target.value)} placeholder="Twoje imię" maxLength={16} aria-label="Twoje imię" />
            <button className="btn" type="submit" disabled={busy}>Do rankingu</button>
          </form>
        )}
        {board && (
          <p className="results__rank">
            {rank >= 0 ? <>Jesteś <b>#{rank + 1}</b> {board.shared ? 'w rankingu' : 'na tym telefonie'}.</> : 'Poza pierwszą dziesiątką. Jeszcze raz?'}
            {above && <> Do {above.name} brakuje <b>{above.score - score}</b>.</>}
          </p>
        )}

        <div className="results__actions">
          <button className="btn" onClick={onAgain}>Jeszcze raz</button>
          <button className="btn btn--ghost" onClick={challenge}>Wyzwij znajomego</button>
        </div>
        {shareMsg && <p className="results__hint">{shareMsg}</p>}
        <button className="results__close" onClick={onClose}>Zamknij</button>
      </motion.div>
    </motion.div>
  )
}
