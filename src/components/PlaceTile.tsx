import { motion } from 'framer-motion'
import type { Place } from '../data/places'
import { href } from '../lib/router'
import { PlaceBanner } from './PlaceBanner'

interface Props { place: Place; seen: boolean; stamped: boolean; delay?: number }

export function PlaceTile({ place, seen, stamped, delay = 0 }: Props) {
  const state = stamped ? 'stamp' : seen ? 'seen' : 'new'
  return (
    <motion.a href={href({ page: 'place', id: place.id })} className="tile"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <PlaceBanner id={place.id} name={place.name} />
      <span className="tile__body">
        <span className="tile__name">{place.name}</span>
        <span className="tile__region">{place.region}</span>
      </span>
      <span className="tile__state" data-state={state}>{stamped ? '✓' : seen ? '' : '?'}</span>
    </motion.a>
  )
}
