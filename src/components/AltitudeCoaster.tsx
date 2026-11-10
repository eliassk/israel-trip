import { useState } from 'react'
import { TOP_PLACES } from '../data/places'

// Highest to lowest, so the bus rides one long slide down to the Dead Sea.
const ORDER = [...TOP_PLACES].sort((a, b) => b.altitude - a.altitude)

const JOKES: Record<string, string> = {
  jaffa: 'Plaża. Zero metrów zmartwień.',
  megiddo: 'Mała górka, wielka historia.',
  sachne: 'Ciepłe baseny, już pod poziomem morza.',
  galilee: 'Jesteśmy POD poziomem morza, a nadal sucho.',
  golan: 'Ponad kilometr w górę. Uszy pykają, autobus sapie.',
  caliber: 'Góry Judzkie. Wysoko i wietrznie.',
  jerusalem: 'Do Jerozolimy się „wstępuje”. Dosłownie.',
  desert: 'Zjazd na pustynię. Herbata przy ognisku.',
  masada: 'Twierdza na skale, a i tak prawie na poziomie morza.',
  deadsea: 'Najniżej na całym lądzie Ziemi! Z Jerozolimy to ponad 1100 m w dół.',
  shefayim: 'Znowu przy morzu. Konferencja!',
}

const W = 320
const y = (alt: number) => 20 + ((1150 - alt) / 1600) * 120
const x = (i: number) => 14 + (i * (W - 28)) / (ORDER.length - 1)

export function AltitudeCoaster() {
  const [pos, setPos] = useState(0)
  const alts = ORDER.map(p => p.altitude)
  const last = alts.length - 1
  const i = Math.min(last - 1, Math.floor(pos))
  const f = pos - i
  const alt = alts[i] + (alts[i + 1] - alts[i]) * f
  const near = ORDER[Math.round(pos)]
  const tilt = Math.max(-35, Math.min(35, -(alts[i + 1] - alts[i]) / 25))
  const line = alts.map((a, k) => `${k ? 'L' : 'M'}${x(k)},${y(a)}`).join(' ')

  return (
    <section className="panel">
      <h3>Kolejka górska wysokości</h3>
      <p>Zjedź autobusem od najwyższego do najniższego miejsca. Izrael to góra i dół, dosłownie.</p>
      <svg viewBox={`0 0 ${W} 170`} className="coaster">
        <line x1={0} x2={W} y1={y(0)} y2={y(0)} stroke="var(--sea)" strokeWidth={2} strokeDasharray="4 3" />
        <text x={W - 4} y={y(0) - 4} textAnchor="end" className="coaster__label">poziom morza</text>
        <path d={`M${x(0)},150 ${line.slice(1)} L${x(last)},150Z`} fill="var(--hill)" opacity={0.6} />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinejoin="round" />
        <text x={x(pos)} y={y(alt) - 4} textAnchor="middle" fontSize={22} transform={`rotate(${tilt} ${x(pos)} ${y(alt) - 10})`}>🚌</text>
      </svg>
      <input id="coaster" type="range" min={0} max={last * 100} value={pos * 100} onChange={e => setPos(+e.target.value / 100)} aria-label="Przesuń autobus" />
      <div className="coaster__readout">
        <span className="coaster__alt">{alt > 0.5 ? '+' : ''}{Math.round(alt)} m</span>
        <span className="coaster__place">{near.name}</span>
      </div>
      <p className="coaster__say">{JOKES[near.id]}</p>
    </section>
  )
}
