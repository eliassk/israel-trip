import { PLACES, type PlaceId } from '../data/places'
import { href } from '../lib/router'
import { Passport } from '../components/Passport'

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
