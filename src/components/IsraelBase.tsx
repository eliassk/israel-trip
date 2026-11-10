import { BORDERS, LAND } from '../data/mapGeometry'
import { DEAD_SEA, GALILEE, JORDAN, MAP_H, MAP_W, project, toPath, type LatLon } from '../lib/geo'

const ISRAEL = new Set(['376', '275'])

const LABELS: { text: string; at: LatLon; cls: string; rotate?: number }[] = [
  { text: 'Morze Śródziemne', at: [32.3, 34.25], cls: 'map__sea', rotate: -72 },
  { text: 'LIBAN', at: [33.3, 35.4], cls: 'map__country' },
  { text: 'SYRIA', at: [33.35, 36.0], cls: 'map__country' },
  { text: 'JORDANIA', at: [31.0, 35.95], cls: 'map__country' },
  { text: 'EGIPT', at: [30.2, 34.15], cls: 'map__country' },
  { text: 'ISRAEL', at: [30.45, 34.85], cls: 'map__israel' },
]

export function IsraelBase({ labels = true }: { labels?: boolean }) {
  return (
    <g>
      <rect width={MAP_W} height={MAP_H} fill="var(--sea)" />
      {LAND.map(c => (
        <path key={c.id} d={c.d} fill={ISRAEL.has(c.id) ? 'var(--land)' : 'var(--land-out)'} />
      ))}
      <path d={BORDERS} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2" />
      <path d={toPath(JORDAN)} fill="none" stroke="var(--water)" strokeWidth={1.8} strokeLinecap="round" />
      <path d={toPath(GALILEE, true)} fill="var(--water)" />
      <path d={toPath(DEAD_SEA, true)} fill="var(--water)" />
      {labels && LABELS.map(l => {
        const [x, y] = project(l.at)
        return <text key={l.text} x={x} y={y} className={l.cls} textAnchor="middle" transform={l.rotate ? `rotate(${l.rotate} ${x} ${y})` : undefined}>{l.text}</text>
      })}
    </g>
  )
}
