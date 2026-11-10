import { useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'
import { Leaderboard } from '../components/Leaderboard'

interface Item { name: string; emoji: string; ask: number }

const ITEMS: Item[] = [
  { name: 'Pudełko chałwy', emoji: '🍬', ask: 60 },
  { name: 'Torebka przypraw', emoji: '🌶️', ask: 40 },
  { name: 'Szal z Jerozolimy', emoji: '🧣', ask: 120 },
]
const PATIENCE = 3

interface Deal { item: Item; floor: number; ask: number; patience: number; offer: number }

const newDeal = (item: Item): Deal => ({
  item,
  // Each seller has a secret lowest price between 50% and 70% of the asking price.
  floor: Math.round(item.ask * (0.5 + Math.random() * 0.2)),
  ask: item.ask,
  patience: PATIENCE,
  offer: Math.round(item.ask * 0.6),
})

export function HaggleGame({ onDone }: ToyProps) {
  const [phase, setPhase] = useState<'idle' | 'play' | 'over'>('idle')
  const [index, setIndex] = useState(0)
  const [deal, setDeal] = useState<Deal>(() => newDeal(ITEMS[0]))
  const [saved, setSaved] = useState(0)
  const [line, setLine] = useState('')

  const close = (price: number, text: string) => {
    const total = saved + (deal.item.ask - price)
    setSaved(total)
    setLine(text)
    if (index + 1 === ITEMS.length) {
      setPhase('over')
      onDone()
      return
    }
    setIndex(index + 1)
    setDeal(newDeal(ITEMS[index + 1]))
  }

  const offer = () => {
    const d = deal
    if (d.offer >= d.floor) return close(d.offer, `„Sababa! Bierz za ${d.offer} ₪, przyjacielu!”`)
    if (d.offer < d.floor * 0.75) {
      const patience = d.patience - 1
      if (patience === 0) return close(d.item.ask, '„Obraziłeś mnie! Pełna cena i ani szekla mniej!”')
      setDeal({ ...d, patience })
      return setLine('„Co?! Chcesz, żeby moje dzieci głodowały?!”')
    }
    const ask = Math.max(d.floor, Math.round(d.ask - (d.ask - d.offer) * 0.45))
    setDeal({ ...d, ask })
    setLine(`„Dla ciebie specjalnie: ${ask} ₪. Ostatnia cena!”`)
  }

  const start = () => {
    setIndex(0)
    setSaved(0)
    setDeal(newDeal(ITEMS[0]))
    setLine('„Szalom! Wszystko świeże, wszystko najlepsze!”')
    setPhase('play')
  }

  return (
    <div className="game">
      <Stage background="linear-gradient(#3b2a4a, #7a3b2e)" height={290}>
        <div className="hud"><span>💰 {saved} ₪</span><span>{index + 1} / {ITEMS.length}</span></div>
        {phase === 'play' && (
          <div className="haggle">
            <div className="haggle__seller">👳‍♂️ <span>{line}</span></div>
            <div className="haggle__item">
              <span className="haggle__emoji">{deal.item.emoji}</span>
              <span><b>{deal.item.name}</b><br />Cena: {deal.ask} ₪</span>
              <span className="haggle__mood" aria-label="Cierpliwość sprzedawcy">{'😤'.repeat(PATIENCE - deal.patience)}{'🙂'.repeat(deal.patience)}</span>
            </div>
            <label className="haggle__offer" htmlFor="haggle-offer">Twoja oferta: <b>{deal.offer} ₪</b></label>
            <input id="haggle-offer" type="range" min={Math.round(deal.item.ask * 0.2)} max={deal.ask} value={deal.offer}
              onChange={e => setDeal({ ...deal, offer: +e.target.value })} />
            <button className="btn" onClick={offer}>Proponuję!</button>
          </div>
        )}
        {phase !== 'play' && (
          <div className="stage__overlay">
            {phase === 'over' && <p className="stage__big">Zaoszczędzone: {saved} ₪</p>}
            <p>{phase === 'over' ? line : 'Na targu Machane Jehuda cena to dopiero początek rozmowy. Kup 3 rzeczy jak najtaniej, ale nie obraź sprzedawcy!'}</p>
            <button className="btn" onClick={start}>{phase === 'idle' ? 'Na targ!' : 'Jeszcze raz'}</button>
          </div>
        )}
      </Stage>
      <Leaderboard game="haggle" pendingScore={phase === 'over' ? saved : null} unit="₪" />
    </div>
  )
}
