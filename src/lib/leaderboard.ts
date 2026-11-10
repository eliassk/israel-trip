import { load, save } from './storage'
import { tg } from './telegram'

export interface Score { id?: string; name: string; score: number; at: number }
export interface Board { scores: Score[]; shared: boolean; myId?: string }

// Scores go to the server. Without it (offline, local dev without the API) they stay in this browser.
const localKey = (game: string) => `scores:${game}`
const sort = (list: Score[]) => list.sort((a, b) => b.score - a.score || a.at - b.at)

function localTop(game: string): Score[] {
  return sort(load<Score[]>(localKey(game), [])).slice(0, 10)
}

export async function fetchBoard(game: string): Promise<Board> {
  try {
    const res = await fetch(`/api/scores/${game}`)
    if (!res.ok) throw new Error(String(res.status))
    const { scores } = await res.json()
    return { scores, shared: true }
  } catch {
    return { scores: localTop(game), shared: false }
  }
}

export async function submitScore(game: string, name: string, score: number): Promise<Board> {
  try {
    const res = await fetch(`/api/scores/${game}`, {
      method: 'POST',
      // Inside Telegram the server takes the player's name from this signed data, not from the body.
      headers: { 'content-type': 'application/json', ...(tg ? { 'x-telegram-init-data': tg.initData } : {}) },
      body: JSON.stringify({ name, score }),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? String(res.status))
    return { scores: body.scores, shared: true, myId: body.id }
  } catch {
    const id = `local-${Date.now()}`
    save(localKey(game), sort([...load<Score[]>(localKey(game), []), { id, name, score, at: Date.now() }]).slice(0, 50))
    return { scores: localTop(game), shared: false, myId: id }
  }
}
