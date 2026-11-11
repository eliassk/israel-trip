import { motion } from 'framer-motion'
import { PLACES, TOP_PLACES, type PlaceId } from '../data/places'
import { MAP_W, project } from '../lib/geo'
import { IsraelBase } from './IsraelBase'

interface Props {
  active: PlaceId | null
  seen: Set<PlaceId>
  stamps: Set<PlaceId>
  onSelect: (id: PlaceId) => void
}

// Every place lies north of the Negev, so the map MUST show only Golan to Masada.
const [, CROP_TOP] = project([33.45, 0])
const [, CROP_BOTTOM] = project([30.95, 0])
const VIEW_BOX = `0 ${CROP_TOP.toFixed(1)} ${MAP_W} ${(CROP_BOTTOM - CROP_TOP).toFixed(1)}`

export function DiscoverMap({ active, seen, stamps, onSelect }: Props) {
  return (
    <div className="map">
      <div className="map__count">Odkryte: {seen.size} / {PLACES.length}</div>
      <svg viewBox={VIEW_BOX} role="img" aria-label="Mapa miejsc do odkrycia">
        <IsraelBase />
        {TOP_PLACES.map((p, i) => {
          const [x, y] = project([p.lat, p.lon])
          const on = p.id === active
          const known = seen.has(p.id)
          const cls = ['pin', on && 'pin--on', known ? 'pin--seen' : 'pin--new', stamps.has(p.id) && 'pin--stamped'].filter(Boolean).join(' ')
          return (
            <motion.g key={p.id} className={cls} tabIndex={0} role="button" aria-label={p.name} aria-pressed={on}
              initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300, damping: 14 }}
              onClick={() => onSelect(p.id)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(p.id))}>
              <circle cx={x} cy={y} r={16} fill="transparent" />
              {(on || !known) && <circle className="pin__ring" cx={x} cy={y} r={9} />}
              <motion.circle className="pin__dot" cx={x} cy={y} r={on ? 10 : 7} initial={false} animate={{ r: on ? 10 : 7 }} />
              <text className="pin__mark" x={x} y={y + 4} textAnchor="middle">{stamps.has(p.id) ? '✓' : known ? '' : '?'}</text>
              <text x={x + p.label.dx} y={y + p.label.dy} textAnchor={p.label.anchor ?? 'end'}>{p.name}</text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
