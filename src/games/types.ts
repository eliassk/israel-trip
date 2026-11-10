import type { FC } from 'react'
import type { PlaceId } from '../data/places'

export interface Point { x: number; y: number }

/** What a game core can ask of the shell. Coordinates are relative to the play area. */
export interface GameApi {
  /** Awards points for a success. With combos on, points are multiplied by the current streak. Returns what was awarded. */
  hit(points: number, at?: Point, label?: string): number
  /** A failure: breaks the combo, shakes the screen and subtracts the penalty. */
  miss(penalty?: number, at?: Point, label?: string): void
  /** A neutral message that does not touch the score. */
  say(text: string, at?: Point): void
  /** Ends the round. Timed games end on their own. */
  finish(): void
  /** Seconds since the round started. */
  elapsed(): number
  /** 0 to 1 through a timed round; 0 for untimed games. */
  progress(): number
}

export interface CoreProps { api: GameApi }

export type GameKey = 'fishing' | 'matkot' | 'tunnel' | 'wallbuilder' | 'range' | 'olivepress' | 'falafel'

export interface GameDef {
  key: GameKey
  /** URL slug under #/gry/. */
  slug: string
  title: string
  icon: string
  rules: string
  unit: string
  /** Seconds. Without it the core ends the round itself. */
  duration?: number
  combo: boolean
  /** Scores for bronze, silver and gold. */
  medals: [number, number, number]
  background: string
  place?: PlaceId
  outro: string
  Core: FC<CoreProps>
}

export const MEDALS = ['', '🥉', '🥈', '🥇'] as const

export const medalFor = (def: GameDef, score: number) => def.medals.filter(m => score >= m).length
