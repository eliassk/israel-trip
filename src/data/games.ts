import type { PlaceId } from './places'
import type { GameKey } from '../games/types'
import { GAME_DEFS, GAME_ORDER } from '../games/registry'

export type GameId = string

export interface Game {
  title: string
  blurb: string
  icon: string
  /** Playing this game earns the stamp of this place. */
  place?: PlaceId
  ranked: boolean
  /** Set for games that run in the full-screen shell. */
  shell?: GameKey
}

const SHORT: Record<GameKey, string> = {
  fishing: '30 sekund z siecią. Złowisz więcej niż Piotr?',
  range: 'Refleks i rozwaga: trafiaj tarcze, oszczędzaj swoich.',
  matkot: 'Plażowe odbijanie bez siatki. Ile odbić wytrzymasz?',
  excavation: 'Łap skarby, omijaj śmieci turystów.',
  wallbuilder: 'Układaj kamienie jak budowniczowie świątyni.',
  haggle: 'Kup taniej, ale nie obraź sprzedawcy.',
  olivepress: '10 sekund szybkiego stukania.',
}

export const GAMES: Record<GameId, Game> = {
  ...Object.fromEntries(GAME_ORDER.map(k => {
    const d = GAME_DEFS[k]
    return [d.slug, { title: d.title, blurb: SHORT[k], icon: d.icon, place: d.place, ranked: true, shell: k }]
  })),
  gdzie: { title: 'Gdzie to jest?', blurb: 'Stuknij na mapie, gdzie leży miejsce.', icon: '📍', ranked: true },
  kolejka: { title: 'Kolejka górska wysokości', blurb: 'Zjedź autobusem z Golanu nad Morze Martwe.', icon: '🚌', ranked: false },
}

export const GAME_IDS = Object.keys(GAMES)
