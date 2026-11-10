import { useEffect, useRef, useState } from 'react'
import type { CoreProps } from '../types'

const ROW = 28
const BASE_W = 190

interface Block { x: number; w: number }

export function WallCore({ api }: CoreProps) {
  const root = useRef<HTMLDivElement>(null)
  const mover = useRef<HTMLDivElement>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [size, setSize] = useState({ w: 320, h: 500 })
  const pos = useRef({ x: 0, v: 2.4, w: BASE_W })
  const over = useRef(false)

  useEffect(() => {
    const el = root.current!
    const s = { w: el.clientWidth, h: el.clientHeight }
    setSize(s)
    setBlocks([{ x: (s.w - BASE_W) / 2, w: BASE_W }])
    let raf = 0
    const tick = () => {
      const p = pos.current
      p.x += p.v
      if (p.x < 0 || p.x + p.w > s.w) p.v *= -1
      if (mover.current) mover.current.style.transform = `translateX(${p.x}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // The camera follows the wall once it reaches the middle of the screen.
  const visible = Math.floor((size.h * 0.55) / ROW)
  const shift = Math.max(0, blocks.length - visible) * ROW
  const y = (row: number) => size.h - (row + 1) * ROW + shift

  const drop = () => {
    if (over.current || blocks.length === 0) return
    const top = blocks[blocks.length - 1]
    const p = pos.current
    const left = Math.max(top.x, p.x)
    const right = Math.min(top.x + top.w, p.x + p.w)
    const at = { x: (left + right) / 2, y: y(blocks.length) }
    if (right - left < 4) {
      over.current = true
      api.miss(0, at, 'Runął!')
      api.finish()
      return
    }
    // A near-perfect drop snaps into place, like a Herodian ashlar.
    const perfect = Math.abs(p.x - top.x) < 5
    const placed = perfect ? { ...top } : { x: left, w: right - left }
    setBlocks(b => [...b, placed])
    api.hit(1, at, perfect ? 'Idealnie!' : undefined)
    pos.current = { x: Math.random() < 0.5 ? 0 : size.w - placed.w, v: Math.min(8, Math.abs(p.v) * 1.06) * (Math.random() < 0.5 ? 1 : -1), w: placed.w }
  }

  return (
    <div ref={root} className="core core--tap" onPointerDown={drop}>
      {blocks.map((b, i) => <div key={i} className="ashlar" style={{ left: b.x, top: y(i), width: b.w, height: ROW - 3 }} />)}
      {blocks.length > 0 && <div ref={mover} className="ashlar ashlar--moving" style={{ left: 0, top: y(blocks.length), width: pos.current.w, height: ROW - 3 }} />}
    </div>
  )
}
