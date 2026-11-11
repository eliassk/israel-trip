import { useRef, useState } from 'react'
import { TOP_PLACES, childrenOf, placeById, type Place, type PlaceId } from '../data/places'
import { go, href } from '../lib/router'
import { TOYS } from '../toys'
import { PlaceBanner } from '../components/PlaceBanner'
import { Quiz } from '../components/Quiz'
import { PlaceTile } from '../components/PlaceTile'
import { VERSES } from '../data/verses'

interface Props { place: Place; seen: Set<PlaceId>; stamps: Set<PlaceId>; onStamp: () => void }

export function PlacePage({ place, seen, stamps, onStamp }: Props) {
  const stamped = stamps.has(place.id)
  const siblings = place.parent ? childrenOf(place.parent) : TOP_PLACES
  const children = childrenOf(place.id)
  const parent = place.parent ? placeById[place.parent] : null
  const index = siblings.indexOf(place)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const toy = place.toy ? TOYS[place.toy] : null
  const touchX = useRef<number | null>(null)

  // Swipes that start inside a game MUST NOT change the place.
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = (e.target as HTMLElement).closest('.stage, input, textarea, .board') ? null : e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    const target = dx < 0 ? next : prev
    if (Math.abs(dx) > 70 && target) go({ page: 'place', id: target.id })
  }

  return (
    <article className={`place${place.highlight ? ' place--highlight' : ''}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="place__hero">
        <PlaceBanner id={place.id} name={place.name} />
        <a className="place__back" href={href(parent ? { page: 'place', id: parent.id } : { page: 'discover' })} aria-label={parent ? `Wróć: ${parent.name}` : 'Wróć do mapy'}>←</a>
      </div>
      <div className="place__body">
        <div className="place__meta"><span>{place.region}</span><span>{index + 1} / {siblings.length}</span></div>
        <h2>{place.name}</h2>
        <p>{place.intro}</p>
        {children.length > 0 && (
          <section className="subplaces">
            <b className="play__label">Miejsca w mieście</b>
            <div className="tiles">
              {children.map(c => <PlaceTile key={c.id} place={c} seen={seen.has(c.id)} stamped={stamps.has(c.id)} />)}
            </div>
          </section>
        )}
        <ul className="facts">{place.facts.map(f => typeof f === 'string'
          ? <li key={f}>{f}</li>
          : <li key={f.ref} className="facts__verse"><blockquote className="verse">„{f.text}”<small>{f.ref} · Biblia Warszawska</small></blockquote></li>)}</ul>
        {place.bible && (
          <section className="bible">
            <b className="bible__label">W Biblii</b>
            <ol className="bible__list">
              {place.bible.map(b => (
                <BibleItem key={b.ref} where={b.where} reference={b.ref} />
              ))}
            </ol>
          </section>
        )}
        <section className="play">
          <b className="play__label">{toy ? 'Zabawa' : 'Pytanie'}{stamped && ' · pieczątka zdobyta ✓'}</b>
          {toy ? (
            <>
              <span className="play__title">{toy.title}</span>
              <toy.Component onDone={onStamp} />
            </>
          ) : place.quiz && <Quiz quiz={place.quiz} solved={stamped} onSolve={onStamp} />}
        </section>
        <nav className="place__nav">
          {prev ? <a href={href({ page: 'place', id: prev.id })}>← {prev.name}</a> : <span />}
          {next ? <a href={href({ page: 'place', id: next.id })}>{next.name} →</a> : <span />}
        </nav>
      </div>
    </article>
  )
}

const LONG = 140

function BibleItem({ where, reference }: { where: string; reference: string }) {
  const [open, setOpen] = useState(false)
  const verse = VERSES[reference]
  const long = !!verse && verse.text.length > LONG
  return (
    <li>
      <span className="bible__ref">{reference}</span>
      <div className="bible__body">
        <span className="bible__where">{where}</span>
        {verse && (
          <blockquote className={'bible__quote' + (long && !open ? ' is-clamped' : '')}>
            „{verse.text}”{verse.at && <small> {verse.at}</small>}
          </blockquote>
        )}
        {long && (
          <button className="bible__more" onClick={() => setOpen(o => !o)} aria-expanded={open}>
            {open ? 'Zwiń' : 'Rozwiń'}
          </button>
        )}
      </div>
    </li>
  )
}
