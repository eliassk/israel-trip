import { GAMES, type GameId } from '../data/games'
import { placeById } from '../data/places'
import { href } from '../lib/router'
import { GameLauncher } from '../games/GameLauncher'
import { GuessGame } from '../components/GuessGame'
import { AltitudeCoaster } from '../components/AltitudeCoaster'

interface Props { id: GameId; onStamp: () => void }

export function GamePage({ id, onStamp }: Props) {
  const g = GAMES[id]
  const body = g.shell ? <GameLauncher game={g.shell} onDone={onStamp} />
    : id === 'gdzie' ? <GuessGame />
    : <AltitudeCoaster />
  return (
    <>
      <a className="backlink" href={href({ page: 'games' })}>← Wszystkie gry</a>
      <header className="hero">
        <span className="eyebrow">{g.icon} Gra</span>
        <h1 className="hero__h1--small">{g.title}</h1>
        <p className="lede">{g.blurb}</p>
        {g.place && <a className="chip" href={href({ page: 'place', id: g.place })}>O miejscu: {placeById[g.place].name} →</a>}
      </header>
      <div className="play">{body}</div>
    </>
  )
}
