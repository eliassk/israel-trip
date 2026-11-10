import { useState } from 'react'
import type { CoreProps } from '../types'

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

export function HaggleCore({ api }: CoreProps) {
  const [index, setIndex] = useState(0)
  const [deal, setDeal] = useState<Deal>(() => newDeal(ITEMS[0]))
  const [line, setLine] = useState('„Szalom! Wszystko świeże, wszystko najlepsze!”')

  const close = (price: number, text: string) => {
    const saved = deal.item.ask - price
    setLine(text)
    if (saved > 0) api.hit(saved, undefined, `−${saved} ₪`)
    else api.miss(0, undefined, 'Pełna cena…')
    if (index + 1 === ITEMS.length) {
      setTimeout(api.finish, 900)
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
      api.say('😤')
      return setLine('„Co?! Chcesz, żeby moje dzieci głodowały?!”')
    }
    const ask = Math.max(d.floor, Math.round(d.ask - (d.ask - d.offer) * 0.45))
    setDeal({ ...d, ask })
    setLine(`„Dla ciebie specjalnie: ${ask} ₪. Ostatnia cena!”`)
  }

  return (
    <div className="core haggle">
      <div className="haggle__stall">{ITEMS.map((it, i) => <span key={it.name} data-done={i < index || undefined}>{it.emoji}</span>)}</div>
      <div className="haggle__seller"><span className="haggle__face">👳‍♂️</span><span className="haggle__bubble">{line}</span></div>
      <div className="haggle__item">
        <span className="haggle__emoji">{deal.item.emoji}</span>
        <span><b>{deal.item.name}</b><br />Cena: {deal.ask} ₪</span>
        <span className="haggle__mood" aria-label="Cierpliwość sprzedawcy">{'😤'.repeat(PATIENCE - deal.patience)}{'🙂'.repeat(deal.patience)}</span>
      </div>
      <label className="haggle__offer" htmlFor="haggle-offer">Twoja oferta: <b>{deal.offer} ₪</b></label>
      <input id="haggle-offer" type="range" min={Math.round(deal.item.ask * 0.2)} max={deal.ask} value={deal.offer}
        onChange={e => setDeal({ ...deal, offer: +e.target.value })} />
      <button className="btn haggle__go" onClick={offer}>Proponuję!</button>
      <p className="haggle__count">Rzecz {index + 1} z {ITEMS.length}</p>
    </div>
  )
}
