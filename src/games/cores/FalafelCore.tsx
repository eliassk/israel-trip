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
const VIP_EVERY = 5
const VIP = '🤵'
/** The last seconds before Shabbat: every order pays double. */
const RUSH_FROM = 0.78

const SPICES = ['#c8452c', '#e0a526', '#8a5a2b', '#6f8a3a', '#d9732f', '#a33a2a']

/** Striped awning, string lights, spice shelves and produce crates around the stall. */
function Stall() {
  return (
    <div className="stall" aria-hidden="true">
      <div className="stall__awning" />
      <div className="stall__lights">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 5) * 0.3}s` }} />)}</div>
      <div className="stall__shelf stall__shelf--l">
        {SPICES.slice(0, 3).map(c => <span key={c} className="stall__spice" style={{ background: c }} />)}
      </div>
      <div className="stall__shelf stall__shelf--r">
        {SPICES.slice(3).map(c => <span key={c} className="stall__spice" style={{ background: c }} />)}
      </div>
      <div className="stall__hang stall__hang--l">🧄🌶️🧄</div>
      <div className="stall__hang stall__hang--r">🌶️🧄🌶️</div>
      <div className="stall__crate stall__crate--l">🍊🍊🍋🍊</div>
      <div className="stall__crate stall__crate--r">🍆🫑🍆🫑</div>
    </div>
  )
}

interface Order { id: number; face: string; items: number[]; born: number; until: number; vip: boolean }

const newOrder = (progress: number, count: number): Order => {
  const size = 2 + Math.floor(Math.random() * (2 + progress * 2))
  const items = Array.from({ length: Math.min(5, size) }, () => Math.floor(Math.random() * INGREDIENTS.length))
  const now = Date.now()
  // Customers get less patient as the rush goes on.
  const vip = count > 0 && count % VIP_EVERY === 0
  return { id: now, face: vip ? VIP : CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)], items, born: now, until: now + (9000 - progress * 4000), vip }
}

export function FalafelCore({ api }: CoreProps) {
  const count = useRef(0)
  const rushOn = useRef(false)
  const [rush, setRush] = useState(false)
  const [order, setOrder] = useState<Order>(() => newOrder(0, 0))
  const [built, setBuilt] = useState<number[]>([])
  const [now, setNow] = useState(Date.now())
  const orderRef = useRef(order)
  orderRef.current = order

  useEffect(() => {
    const iv = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (!rushOn.current && api.progress() >= RUSH_FROM) {
        rushOn.current = true
        setRush(true)
        api.announce('Za chwilę szabat! Napiwki ×2')
      }
      if (t > orderRef.current.until) {
        api.miss(0, undefined, 'Klient odszedł…')
        setOrder(newOrder(api.progress(), ++count.current))
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
    // VIPs and the pre-Shabbat rush each double the tip.
    const tip = (BASE_POINTS + Math.round(left * 10)) * (order.vip ? 2 : 1) * (rushOn.current ? 2 : 1)
    api.hit(tip, { x: root.width / 2, y: 120 }, order.vip ? `VIP! +${tip}` : undefined)
    const upcoming = newOrder(api.progress(), ++count.current)
    if (upcoming.vip) api.announce('Klient VIP! Napiwek ×2')
    setOrder(upcoming)
    setBuilt([])
  }

  const patience = Math.max(0, (order.until - now) / (order.until - order.born))
  return (
    <div className={`core falafel${rush ? ' falafel--rush' : ''}${order.vip ? ' falafel--vip' : ''}`}>
      <Stall />
      <div className="falafel__customer">
        <span className="falafel__face">{order.face}</span>
        <div className="falafel__bubble">
          {order.items.map((it, k) => (
            <span key={k} data-done={k < built.length || undefined}>{INGREDIENTS[it].emoji}</span>
          ))}
        </div>
      </div>
      <div className="falafel__patience"><i style={{ transform: `scaleX(${patience})`, background: patience < 0.3 ? '#e85d4a' : '#7bd389' }} /></div>
      <div className="falafel__counter">
        <div className="falafel__board">
          <span className="falafel__base">🫓</span>
          {built.map((it, k) => <span key={k} className="falafel__layer">{INGREDIENTS[it].emoji}</span>)}
        </div>
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
