import { PLACES, type PlaceId } from '../data/places'
import { href } from '../lib/router'
import { Passport } from '../components/Passport'
import { GAME_DEFS, GAME_ORDER } from '../games/registry'
import { MEDALS, medalFor } from '../games/types'
import { getBest } from '../lib/best'

interface Props { seen: Set<PlaceId>; stamps: Set<PlaceId>; fresh: PlaceId | null }

export function PassportPage({ seen, stamps, fresh }: Props) {
  const missing = PLACES.filter(p => !stamps.has(p.id))
  return (
    <>
      <header className="hero">
        <span className="eyebrow">Twoje postępy</span>
        <h1>Paszport</h1>
        <p className="lede">Odkryte miejsca: {seen.size} z {PLACES.length}. Pieczątki: {stamps.size} z {PLACES.length}.</p>
      </header>
      <Passport stamps={stamps} fresh={fresh} />
      <section className="panel">
        <h3>Medale</h3>
        <ul className="medals">
          {GAME_ORDER.map(k => {
            const d = GAME_DEFS[k]
            const best = getBest(k)
            const m = medalFor(d, best)
            return (
              <li key={k}>
                <a href={href({ page: 'game', id: d.slug })}>
                  <span className="medals__icon">{d.icon}</span>
                  <span className="medals__name">{d.title}<small>{best > 0 ? `Rekord: ${best} ${d.unit}` : 'Jeszcze nie grane'}</small></span>
                  <span className="medals__medal" data-none={!m || undefined}>{m ? MEDALS[m] : '—'}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </section>
      {missing.length > 0 ? (
        <section className="panel">
          <h3>Brakuje jeszcze</h3>
          <div className="chips">
            {missing.map(p => <a key={p.id} className="chip" href={href({ page: 'place', id: p.id })}>{p.name}</a>)}
          </div>
        </section>
      ) : (
        <section className="panel"><h3>Komplet! 🎉</h3><p>Masz wszystkie pieczątki. Pokaż paszport liderowi.</p></section>
      )}
    </>
  )
}
