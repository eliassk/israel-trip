import { useEffect, useState } from 'react'
import { fetchBoard, submitScore, type Board } from '../lib/leaderboard'
import { load, save } from '../lib/storage'

interface Props {
  game: string
  /** Set when a round just ended and its score is not saved yet. */
  pendingScore: number | null
  unit: string
}

const MEDALS = ['🥇', '🥈', '🥉']

export function Leaderboard({ game, pendingScore, unit }: Props) {
  const [board, setBoard] = useState<Board | null>(null)
  const [name, setName] = useState(() => load('playerName', ''))
  const [savedFor, setSavedFor] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let live = true
    fetchBoard(game).then(b => live && setBoard(b))
    return () => { live = false }
  }, [game])
  useEffect(() => setSavedFor(null), [pendingScore])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pendingScore == null || !name.trim() || busy) return
    setBusy(true)
    save('playerName', name.trim())
    setBoard(await submitScore(game, name.trim(), pendingScore))
    setSavedFor(pendingScore)
    setBusy(false)
  }

  const scores = board?.scores ?? []
  return (
    <div className="board">
      <div className="board__head">
        <b>Ranking</b>
        <span>{board == null ? 'Ładowanie…' : board.shared ? 'wszyscy gracze' : 'na tym telefonie'}</span>
      </div>
      {pendingScore != null && savedFor !== pendingScore && (
        <form className="board__form" onSubmit={submit}>
          <input id={`name-${game}`} value={name} onChange={e => setName(e.target.value)} placeholder="Twoje imię" maxLength={16} aria-label="Twoje imię" />
          <button className="btn" type="submit" disabled={busy}>Zapisz {pendingScore}</button>
        </form>
      )}
      {board != null && scores.length === 0 ? (
        <p className="board__empty">Jeszcze nikt nie grał. Bądź pierwszy!</p>
      ) : (
        <ol className="board__list">
          {scores.map((s, i) => (
            <li key={s.id ?? s.at} data-me={(s.id != null && s.id === board?.myId) || undefined}>
              <span className="board__rank">{MEDALS[i] ?? i + 1}</span>
              <span className="board__name">{s.name}</span>
              <span className="board__score">{s.score} {unit}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
