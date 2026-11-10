import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'

const INGREDIENTS = [
  { emoji: '🧆', name: 'falafel' },
  { emoji: '🥙', name: 'hummus' },
  { emoji: '🍅', name: 'pomidor' },
  { emoji: '🥒', name: 'ogórek' },
  { emoji: '🧅', name: 'cebula' },
  { emoji: '🌶️', name: 'ostry sos' },
] as const
const CUSTOMERS = ['👨‍🦱', '👩', '👴', '👧', '🧔', '👩‍🦰', '👨‍🦳', '🧕']
const BASE_POINTS = 10

interface Order { id: number; face: string; items: number[]; born: number; until: number }

const newOrder = (progress: number): Order => {
  const size = 2 + Math.floor(Math.random() * (2 + progress * 2))
  const items = Array.from({ length: Math.min(5, size) }, () => Math.floor(Math.random() * INGREDIENTS.length))
  const now = Date.now()
  // Customers get less patient as the rush goes on.
  return { id: now, face: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)], items, born: now, until: now + (9000 - progress * 4000) }
}

export function FalafelCore({ api }: CoreProps) {
  const [order, setOrder] = useState<Order>(() => newOrder(0))
  const [built, setBuilt] = useState<number[]>([])
  const [now, setNow] = useState(Date.now())
  const orderRef = useRef(order)
  orderRef.current = order

  useEffect(() => {
    const iv = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t > orderRef.current.until) {
        api.miss(0, undefined, 'Klient odszedł…')
        setOrder(newOrder(api.progress()))
        setBuilt([])
      }
    }, 100)
    return () => clearInterval(iv)
  }, [api])

  const add = (i: number, e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const root = e.currentTarget.closest('.falafel')!.getBoundingClientRect()
    const at = { x: r.left - root.left + r.width / 2, y: r.top - root.top }
    const next = order.items[built.length]
    if (i !== next) {
      api.miss(0, at, `Nie ${INGREDIENTS[i].name}!`)
      setBuilt([])
      return
    }
    const nb = [...built, i]
    setBuilt(nb)
    if (nb.length < order.items.length) return
    // Faster service earns a bigger tip.
    const left = Math.max(0, order.until - Date.now()) / (order.until - order.born)
    api.hit(BASE_POINTS + Math.round(left * 10), { x: root.width / 2, y: 120 }, undefined)
    setOrder(newOrder(api.progress()))
    setBuilt([])
  }

  const patience = Math.max(0, (order.until - now) / (order.until - order.born))
  return (
    <div className="core falafel">
      <div className="falafel__customer">
        <span className="falafel__face">{order.face}</span>
        <div className="falafel__bubble">
          {order.items.map((it, k) => (
            <span key={k} data-done={k < built.length || undefined}>{INGREDIENTS[it].emoji}</span>
          ))}
        </div>
      </div>
      <div className="falafel__patience"><i style={{ transform: `scaleX(${patience})`, background: patience < 0.3 ? '#e85d4a' : '#7bd389' }} /></div>
      <div className="falafel__pita">
        <span className="falafel__base">🫓</span>
        {built.map((it, k) => <span key={k} className="falafel__layer">{INGREDIENTS[it].emoji}</span>)}
      </div>
      <div className="falafel__bins">
        {INGREDIENTS.map((ing, i) => (
          <button key={ing.name} className="falafel__bin" onPointerDown={e => add(i, e)} aria-label={ing.name}>
            <span>{ing.emoji}</span><small>{ing.name}</small>
          </button>
        ))}
      </div>
    </div>
  )
}
