import { useEffect, useState } from 'react'
import { GAME_DEFS } from './registry'
import { MEDALS, medalFor, type GameKey } from './types'
import { GameShell } from './GameShell'
import { Leaderboard } from '../components/Leaderboard'
import { getBest } from '../lib/best'
import { unlock } from '../lib/sound'

interface Props { game: GameKey; onDone?: () => void }

export function GameLauncher({ game, onDone }: Props) {
  const def = GAME_DEFS[game]
  const [open, setOpen] = useState(false)
  const [round, setRound] = useState(0)
  const best = getBest(game)
  const medal = medalFor(def, best)

  // Opening pushes a history entry, so the phone's (and Telegram's) back button closes the game.
  useEffect(() => {
    if (!open) return
    const onPop = () => setOpen(false)
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [open])

  const start = () => {
    unlock()
    history.pushState({ game }, '')
    setOpen(true)
  }

  return (
    <div className="launcher">
      <button className="launcher__card" style={{ background: def.background }} onClick={start}>
        <span className="launcher__icon" aria-hidden="true">{def.icon}</span>
        <span className="launcher__text">
          <span className="launcher__title">{def.title}</span>
          <span className="launcher__best">{best > 0 ? <>Twój rekord: {best} {def.unit} {MEDALS[medal]}</> : 'Jeszcze nie grałeś'}</span>
        </span>
        <span className="launcher__play">Graj</span>
      </button>
      <p className="launcher__rules">{def.rules}</p>
      <p className="launcher__medals">🥉 {def.medals[0]} · 🥈 {def.medals[1]} · 🥇 {def.medals[2]} {def.unit}</p>
      <Leaderboard key={round} game={game} pendingScore={null} unit={def.unit} />
      {open && (
        <GameShell def={def} onClose={() => history.back()} onFinished={score => {
          setRound(r => r + 1)
          if (score > 0) onDone?.()
        }} />
      )}
    </div>
  )
}
