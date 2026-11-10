import { useEffect, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'
import { Leaderboard } from '../components/Leaderboard'

const H = 300
const ROW = 24
const BASE_W = 170
const VISIBLE_ROWS = 8

interface Block { x: number; w: number }

export function WallBuilderGame({ onDone }: ToyProps) {
  const [phase, setPhase] = useState<'idle' | 'play' | 'over'>('idle')
  const [blocks, setBlocks] = useState<Block[]>([])
  const stage = useRef<HTMLDivElement>(null)
  const mover = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, v: 2.2, w: BASE_W })
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  const width = () => stage.current?.clientWidth ?? 320
  const score = Math.max(0, blocks.length - 1)
  const shift = Math.max(0, blocks.length - VISIBLE_ROWS) * ROW

  useEffect(() => {
    if (phase !== 'play') return
    let raf = 0
    const tick = () => {
      const w = width()
      const p = pos.current
      p.x += p.v
      if (p.x < 0 || p.x + p.w > w) p.v *= -1
      if (mover.current) mover.current.style.transform = `translateX(${p.x}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  const drop = () => {
    if (phase !== 'play') return
    const top = blocks[blocks.length - 1]
    const p = pos.current
    const left = Math.max(top.x, p.x)
    const right = Math.min(top.x + top.w, p.x + p.w)
    if (right - left < 4) {
      setPhase('over')
      if (blocks.length > 1) doneRef.current()
      return
    }
    // A near-perfect drop snaps into place, like a Herodian ashlar.
    const perfect = Math.abs(p.x - top.x) < 4
    const placed = perfect ? { ...top } : { x: left, w: right - left }
    setBlocks(b => [...b, placed])
    pos.current = { x: 0, v: Math.min(7, Math.abs(p.v) * 1.06), w: placed.w }
  }

  const start = () => {
    const w = width()
    setBlocks([{ x: (w - BASE_W) / 2, w: BASE_W }])
    pos.current = { x: 0, v: 2.2, w: BASE_W }
    setPhase('play')
  }

  const y = (row: number) => H - (row + 1) * ROW + shift
  return (
    <div className="game">
      <Stage stageRef={stage} height={H} background="linear-gradient(#f7c873, #ffe7b0)" onClick={drop} style={{ cursor: 'pointer' }}>
        <div className="hud"><span>🧱 {score}</span></div>
        {blocks.map((b, i) => <div key={i} className="ashlar" style={{ left: b.x, top: y(i), width: b.w, height: ROW - 2 }} />)}
        {phase === 'play' && <div ref={mover} className="ashlar ashlar--moving" style={{ left: 0, top: y(blocks.length), width: pos.current.w, height: ROW - 2 }} />}
        {phase !== 'play' && (
          <div className="stage__overlay">
            {phase === 'over' && <p className="stage__big">{score} warstw</p>}
            <p>{phase === 'idle'
              ? 'Zbuduj mur jak Herod. Stuknij, żeby położyć kamień. Co wystaje poza mur, odpada.'
              : 'Ściana Zachodnia ma 45 warstw kamieni, w tym 17 pod ziemią.'}</p>
            <button className="btn" onClick={e => { e.stopPropagation(); start() }}>{phase === 'idle' ? 'Budujemy' : 'Jeszcze raz'}</button>
          </div>
        )}
      </Stage>
      <Leaderboard game="wallbuilder" pendingScore={phase === 'over' ? score : null} unit="warstw" />
    </div>
  )
}
