import { PLACES, type PlaceId } from '../data/places'

export function Passport({ stamps, fresh }: { stamps: Set<PlaceId>; fresh: PlaceId | null }) {
  return (
    <section className="passport">
      <h3>Twój paszport</h3>
      <p>{stamps.size} z {PLACES.length} pieczątek. Pobaw się albo odpowiedz na pytanie przy każdym miejscu.</p>
      <div className="stamps">
        {PLACES.map(p => (
          <div key={p.id} className={`stamp${stamps.has(p.id) ? ' stamp--got' : ''}${p.id === fresh ? ' stamp--fresh' : ''}`} title={p.name}>
            {p.name.split(' ')[0]}
          </div>
        ))}
      </div>
    </section>
  )
}
