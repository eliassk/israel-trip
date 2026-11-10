import type { PlaceId } from './places'

export type GameId = 'polow' | 'strzelnica' | 'matkot' | 'wykopaliska' | 'mur' | 'targ' | 'tlocznia' | 'gdzie' | 'kolejka'

export interface Game {
  title: string
  blurb: string
  icon: string
  /** Playing this game earns the stamp of this place. */
  place?: PlaceId
  ranked: boolean
}

export const GAMES: Record<GameId, Game> = {
  polow: { title: 'Połów na Jeziorze Galilejskim', blurb: '30 sekund z siecią. Złowisz więcej niż Piotr?', icon: '🐟', place: 'galilee', ranked: true },
  strzelnica: { title: 'Strzelnica Caliber 3', blurb: 'Refleks i rozwaga: trafiaj tarcze, oszczędzaj swoich.', icon: '🎯', place: 'caliber', ranked: true },
  matkot: { title: 'Matkot w Tel Awiwie', blurb: 'Plażowe odbijanie bez siatki. Ile odbić wytrzymasz?', icon: '🏓', place: 'jaffa', ranked: true },
  wykopaliska: { title: 'Wykopaliska w Megiddo', blurb: 'Łap skarby, omijaj śmieci turystów.', icon: '⛏️', place: 'megiddo', ranked: true },
  mur: { title: 'Mur Heroda', blurb: 'Układaj kamienie jak budowniczowie świątyni.', icon: '🧱', place: 'temple', ranked: true },
  targ: { title: 'Targowanie na Machane Jehuda', blurb: 'Kup taniej, ale nie obraź sprzedawcy.', icon: '🛍️', place: 'market', ranked: true },
  tlocznia: { title: 'Tłocznia w Getsemani', blurb: '10 sekund szybkiego stukania.', icon: '🫒', place: 'olives', ranked: true },
  gdzie: { title: 'Gdzie to jest?', blurb: 'Stuknij na mapie, gdzie leży miejsce.', icon: '📍', ranked: true },
  kolejka: { title: 'Kolejka górska wysokości', blurb: 'Zjedź autobusem z Golanu nad Morze Martwe.', icon: '🚌', ranked: false },
}

export const GAME_IDS = Object.keys(GAMES) as GameId[]
