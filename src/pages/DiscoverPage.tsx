import { TOP_PLACES, type PlaceId } from '../data/places'
import { go } from '../lib/router'
import { DiscoverMap } from '../components/DiscoverMap'
import { PlaceTile } from '../components/PlaceTile'

interface Props { seen: Set<PlaceId>; stamps: Set<PlaceId> }

export function DiscoverPage({ seen, stamps }: Props) {
  return (
    <>
      <header className="hero">
        <h1>Izrael</h1>
        <p className="lede">Pustynia, morze, góry i miasto, w którym chodził Jezus. Odkryj miejsca, zanim staniesz tam naprawdę.</p>
      </header>
      <DiscoverMap active={null} seen={seen} stamps={stamps} onSelect={id => go({ page: 'place', id })} />
      <div className="tiles">
        {TOP_PLACES.map((p, i) => <PlaceTile key={p.id} place={p} seen={seen.has(p.id)} stamped={stamps.has(p.id)} delay={0.05 * i} />)}
      </div>
    </>
  )
}
