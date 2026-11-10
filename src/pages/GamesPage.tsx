import { motion } from 'framer-motion'
import { GAMES, GAME_IDS } from '../data/games'
import { href } from '../lib/router'

export function GamesPage() {
  return (
    <>
      <header className="hero">
        <span className="eyebrow">Zagraj przed wyjazdem</span>
        <h1>Gry</h1>
        <p className="lede">Rywalizuj o miejsce w rankingu. Niektóre gry dają też pieczątkę do paszportu.</p>
      </header>
      <div className="games">
        {GAME_IDS.map((id, i) => {
          const g = GAMES[id]
          return (
            <motion.a key={id} href={href({ page: 'game', id })} className="game-tile"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}>
              <span className="game-tile__icon" aria-hidden="true">{g.icon}</span>
              <span className="game-tile__body">
                <span className="game-tile__title">{g.title}</span>
                <span className="game-tile__blurb">{g.blurb}</span>
              </span>
              {g.ranked && <span className="game-tile__tag">Ranking</span>}
            </motion.a>
          )
        })}
      </div>
    </>
  )
}
