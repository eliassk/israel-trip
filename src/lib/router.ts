import { useEffect, useState } from 'react'
import { placeById, type PlaceId } from '../data/places'
import { GAMES, type GameId } from '../data/games'

export type Route =
  | { page: 'discover' }
  | { page: 'place'; id: PlaceId }
  | { page: 'games' }
  | { page: 'game'; id: GameId }
  | { page: 'passport' }

export function parse(hash: string): Route {
  const [, a, b] = hash.replace(/^#/, '').split('/')
  if (a === 'miejsca' && b && b in placeById) return { page: 'place', id: b as PlaceId }
  if (a === 'gry' && b && b in GAMES) return { page: 'game', id: b as GameId }
  if (a === 'gry') return { page: 'games' }
  if (a === 'paszport') return { page: 'passport' }
  return { page: 'discover' }
}

export function href(r: Route): string {
  switch (r.page) {
    case 'place': return `#/miejsca/${r.id}`
    case 'games': return '#/gry'
    case 'game': return `#/gry/${r.id}`
    case 'passport': return '#/paszport'
    default: return '#/'
  }
}

export const go = (r: Route) => { location.hash = href(r) }

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parse(location.hash))
    addEventListener('hashchange', onChange)
    return () => removeEventListener('hashchange', onChange)
  }, [])
  return route
}
