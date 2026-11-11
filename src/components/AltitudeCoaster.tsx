import { useEffect, useRef, useState } from 'react'
import { placeById, type PlaceId } from '../data/places'

// The trip in order, so the ride climbs and drops the way the bus really will.
const ROUTE: { id: PlaceId; day: number }[] = [
  { id: 'jaffa', day: 1 }, { id: 'megiddo', day: 2 }, { id: 'sachne', day: 2 }, { id: 'galilee', day: 3 },
  { id: 'golan', day: 3 }, { id: 'caliber', day: 4 }, { id: 'jerusalem', day: 5 }, { id: 'desert', day: 6 },
  { id: 'masada', day: 7 }, { id: 'deadsea', day: 7 }, { id: 'shefayim', day: 8 }, { id: 'jaffa', day: 10 },
]

const SAY: Record<string, string> = {
  jaffa: 'Start nad morzem. Zero metrów, zero zmartwień.',
  megiddo: 'Mała górka, wielka historia.',
  sachne: 'Ciepłe baseny, już pod poziomem morza.',
  galilee: 'Jesteśmy POD poziomem morza, a nadal sucho.',
  golan: 'W górę o ponad 1300 m! Uszy pykają, autobus sapie.',
  caliber: 'Góry Judzkie. Wysoko i wietrznie.',
  jerusalem: 'Do Jerozolimy się „wstępuje”. Dosłownie.',
  desert: 'Zjazd na pustynię. Herbata przy ognisku.',
  masada: 'Twierdza na skale, a i tak prawie na poziomie morza.',
  deadsea: 'Najniżej na całym lądzie Ziemi! Z Jerozolimy to ponad 1100 m w dół.',
  shefayim: 'Znowu przy morzu. Konferencja!',
}

const W = 360
const H = 200
const TOP = 1200
const BOTTOM = -500
const y = (alt: number) => 16 + ((TOP - alt) / (TOP - BOTTOM)) * (H - 40)
const x = (i: number) => 16 + (i * (W - 32)) / (ROUTE.length - 1)
const LAST = ROUTE.length - 1
const RIDE_MS = 12000

export function AltitudeCoaster() {
  const [pos, setPos] = useState(0)
  const [riding, setRiding] = useState(false)
  const raf = useRef(0)
  const alts = ROUTE.map(r => placeById[r.id].altitude)
  const i = Math.min(LAST - 1, Math.floor(pos))
  const f = pos - i
  const alt = alts[i] + (alts[i + 1] - alts[i]) * f
  const stop = ROUTE[Math.round(pos)]
  const tilt = Math.max(-40, Math.min(40, Math.atan2(y(alts[i + 1]) - y(alts[i]), x(i + 1) - x(i)) * 180 / Math.PI))
  const line = alts.map((a, k) => `${k ? 'L' : 'M'}${x(k)},${y(a)}`).join(' ')
  const sea = y(0)

  // Play rides the whole trip once; dragging the slider stops it.
  useEffect(() => {
    if (!riding) return
    const start = performance.now() - (pos / LAST) * RIDE_MS
    const tick = (t: number) => {
      const p = Math.min(LAST, ((t - start) / RIDE_MS) * LAST)
      setPos(p)
      if (p < LAST) raf.current = requestAnimationFrame(tick)
      else setRiding(false)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [riding])

  return (
    <section className="panel">
      <h3>Kolejka górska wysokości</h3>
      <p>Tak naprawdę pojedzie nasz autobus: dzień po dniu, w górę i w dół. Izrael to góra i dół, dosłownie.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="coaster">
        <defs>
          <linearGradient id="coaster-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe0f2" /><stop offset="1" stopColor="#f3e7c9" /></linearGradient>
        </defs>
        <rect width={W} height={sea} fill="url(#coaster-sky)" opacity=".5" />
        <rect y={sea} width={W} height={H - sea} fill="#2f6f8f" opacity=".25" />
        <line x1={0} x2={W} y1={sea} y2={sea} stroke="#3b8fb0" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={x(5)} y={sea - 4} textAnchor="middle" className="coaster__label">poziom morza</text>
        <text x={x(5)} y={sea + 12} textAnchor="middle" className="coaster__label">pod poziomem morza</text>
        <path d={`M${x(0)},${H} L${line.slice(1)} L${x(LAST)},${H}Z`} fill="var(--hill)" opacity={0.7} />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth={3} strokeLinejoin="round" />
        {ROUTE.map((r, k) => (
          <g key={k}>
            <circle cx={x(k)} cy={y(alts[k])} r={k === Math.round(pos) ? 5 : 3} fill={k === Math.round(pos) ? 'var(--accent)' : '#fff'} stroke="var(--accent)" strokeWidth="1.5" />
            {(k === 0 || ROUTE[k - 1].day !== r.day) && <text x={x(k)} y={H - 4} textAnchor="middle" className="coaster__label">d{r.day}</text>}
          </g>
        ))}
        <text x={x(pos)} y={y(alt) - 3} textAnchor="middle" fontSize={22} transform={`rotate(${tilt} ${x(pos)} ${y(alt) - 9})`}>🚌</text>
      </svg>
      <div className="coaster__controls">
        <button className="btn" onClick={() => { if (pos >= LAST) setPos(0); setRiding(r => !r) }}>{riding ? '⏸ Stop' : pos >= LAST ? '↺ Jeszcze raz' : '▶ Jedziemy!'}</button>
        <input id="coaster" type="range" min={0} max={LAST * 100} value={Math.round(pos * 100)} onChange={e => { setRiding(false); setPos(+e.target.value / 100) }} aria-label="Przesuń autobus" />
      </div>
      <div className="coaster__readout">
        <span className="coaster__alt">{alt > 0.5 ? '+' : ''}{Math.round(alt)} m</span>
        <span className="coaster__place">Dzień {stop.day} · {placeById[stop.id].name}</span>
      </div>
      <p className="coaster__say">{SAY[stop.id]}</p>
    </section>
  )
}
