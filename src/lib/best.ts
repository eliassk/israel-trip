import { load, save } from './storage'

export const getBest = (game: string) => load<number>(`best:${game}`, 0)

/** Stores the score if it beats the best one. Returns true for a new record. */
export function recordBest(game: string, score: number): boolean {
  if (score <= getBest(game)) return false
  save(`best:${game}`, score)
  return true
}
