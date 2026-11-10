import { useRef, useState } from 'react'
import { TOP_PLACES, type Place } from '../data/places'
import { MAP_H, MAP_W, kmBetween, project, unproject } from '../lib/geo'
import { confetti } from '../lib/confetti'
import { IsraelBase } from './IsraelBase'
import { Leaderboard } from './Leaderboard'

const ROUNDS = 5

interface Guess { x: number; y: number; km: number; points: number }

export function GuessGame() {
  const [picks, setPicks] = useState<Place[]>([])
  const [round, setRound] = useState(-1)
  const [guess, setGuess] = useState<Guess | null>(null)
  const [total, setTotal] = useState(0)
  const svg = useRef<SVGSVGElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const over = round === ROUNDS
  const target = picks[round]

  const start = () => {
    setPicks([...TOP_PLACES].sort(() => Math.random() - 0.5).slice(0, ROUNDS))
    setTotal(0)
    setGuess(null)
    setRound(0)
  }
  const next = () => {
    setGuess(null)
    setRound(r => r + 1)
  }
  const tap = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!target || guess || !svg.current) return
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const m = pt.matrixTransform(svg.current.getScreenCTM()!.inverse())
    const km = Math.round(kmBetween(unproject(m.x, m.y), [target.lat, target.lon]))
    const points = Math.max(0, 100 - km * 2)
    setGuess({ x: m.x, y: m.y, km, points })
    setTotal(t => t + points)
    if (points >= 80) confetti(label.current, 25)
  }

  const [tx, ty] = target ? project([target.lat, target.lon]) : [0, 0]
  const heading = round < 0 ? 'Gotowi?' : over ? `Koniec! ${total} / ${ROUNDS * 100}` : guess ? (guess.km < 8 ? `Idealnie! +${guess.points}` : `${guess.km} km obok · +${guess.points}`) : target.name

  return (
    <section className="panel">
      <h3>Gdzie to jest?</h3>
      <p>Stuknij na mapie tam, gdzie twoim zdaniem leży miejsce. {ROUNDS} rund, im bliżej, tym więcej punktów.</p>
      <div className="guess__row">
        <span className="guess__target" ref={label}>{heading}</span>
        <span>Punkty: {total}</span>
      </div>
      <div className="map map--game">
        <svg ref={svg} viewBox={`0 0 ${MAP_W} ${MAP_H}`} onClick={tap} aria-label="Mapa do zgadywania">
          <IsraelBase labels={false} />
          {guess && (
            <g>
              <line x1={guess.x} y1={guess.y} x2={tx} y2={ty} stroke="var(--ink)" strokeDasharray="4 3" />
              <circle cx={guess.x} cy={guess.y} r={5} fill="var(--ink)" />
              <circle cx={tx} cy={ty} r={8} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />
              <text x={tx} y={ty - 12} textAnchor="middle" className="guess__label">{target.name}</text>
            </g>
          )}
        </svg>
      </div>
      {(round < 0 || over) && <button className="btn" onClick={start}>{over ? 'Zagraj jeszcze raz' : 'Zacznij grę'}</button>}
      {guess && !over && <button className="btn" onClick={next}>{round === ROUNDS - 1 ? 'Pokaż wynik' : 'Dalej'}</button>}
      <Leaderboard game="guess" pendingScore={over ? total : null} unit="pkt" />
    </section>
  )
}
