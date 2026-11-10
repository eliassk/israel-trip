import { useEffect, useState } from 'react'
import type { CoreProps } from '../types'
import { pointIn } from '../usePointer'

const HOLES = 12

interface Find { emoji: string; name: string; points: number }

const FINDS: Find[] = [
  { emoji: '🏺', name: 'dzban', points: 1 },
  { emoji: '🪙', name: 'moneta', points: 2 },
  { emoji: '🏹', name: 'grot', points: 2 },
  { emoji: '📜', name: 'zwój', points: 5 },
  { emoji: '👑', name: 'pieczęć króla', points: 10 },
  { emoji: '🥤', name: 'kubek turysty', points: -3 },
  { emoji: '🩴', name: 'klapek turysty', points: -3 },
]
// Rare finds MUST stay rare; junk SHOULD show up often enough to punish blind tapping.
const WEIGHTS = [30, 20, 15, 6, 2, 14, 13]

const pick = (): Find => {
  let r = Math.random() * WEIGHTS.reduce((a, b) => a + b)
  for (let i = 0; i < FINDS.length; i++) if ((r -= WEIGHTS[i]) < 0) return FINDS[i]
  return FINDS[0]
}

type Slot = { find: Find; until: number; id: number } | null

export function ExcavationCore({ api }: CoreProps) {
  const [slots, setSlots] = useState<Slot[]>(() => Array(HOLES).fill(null))

  useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now()
      // Finds pop up faster and stay shorter as time runs out.
      const pace = 1 + api.progress()
      const spawn = Math.random() < 0.4 * pace
      const find = pick()
      const roll = Math.random()
      setSlots(prev => {
        const next = prev.map(s => (s && s.until < now ? null : s))
        const free = next.flatMap((s, i) => (s ? [] : [i]))
        if (spawn && free.length) next[free[Math.floor(roll * free.length)]] = { find, until: now + 1400 / pace, id: now }
        return next
      })
    }, 120)
    return () => clearInterval(iv)
  }, [api])

  const dig = (i: number, e: React.PointerEvent<HTMLButtonElement>) => {
    const s = slots[i]
    if (!s) return
    const r = e.currentTarget.getBoundingClientRect()
    const root = e.currentTarget.parentElement!.getBoundingClientRect()
    const at = { x: r.left - root.left + r.width / 2, y: r.top - root.top + r.height / 3 }
    setSlots(prev => prev.map((x, j) => (j === i ? null : x)))
    if (s.find.points > 0) api.hit(s.find.points, at, undefined)
    else api.miss(-s.find.points, at, `${s.find.points} ${s.find.name}`)
  }

  return (
    <div className="core dig" onPointerDown={e => e.target === e.currentTarget && api.say('Kop w dołkach!', pointIn(e))}>
      {slots.map((s, i) => (
        <button key={i} className="dig__hole" onPointerDown={e => dig(i, e)} aria-label={s ? s.find.name : 'Pusty wykop'}>
          {s && <span key={s.id} className="dig__find">{s.find.emoji}</span>}
        </button>
      ))}
    </div>
  )
}
