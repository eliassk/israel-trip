import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { PLACES, placeById, type PlaceId } from './data/places'
import { GAMES } from './data/games'
import { useStamps } from './hooks/useStamps'
import { confetti } from './lib/confetti'
import { href, useRoute } from './lib/router'
import { load, save } from './lib/storage'
import { haptic, tg } from './lib/telegram'
import { TabBar } from './components/TabBar'
import { DiscoverPage } from './pages/DiscoverPage'
import { PlacePage } from './pages/PlacePage'
import { GamesPage } from './pages/GamesPage'
import { GamePage } from './pages/GamePage'
import { PassportPage } from './pages/PassportPage'

export default function App() {
  const route = useRoute()
  const { stamps, fresh, add } = useStamps()
  const [seen, setSeen] = useState<Set<PlaceId>>(() => new Set(load<PlaceId[]>('seen', [])))

  useEffect(() => {
    scrollTo({ top: 0 })
    if (route.page !== 'place') return
    setSeen(prev => {
      if (prev.has(route.id)) return prev
      const next = new Set(prev).add(route.id)
      save('seen', [...next])
      return next
    })
  }, [route])

  // Inside Telegram its own back button replaces the in-page arrows.
  useEffect(() => {
    if (!tg) return
    const back = () => history.back()
    const deep = route.page === 'place' || route.page === 'game'
    if (deep) tg.BackButton.show()
    else tg.BackButton.hide()
    tg.BackButton.onClick(back)
    return () => tg?.BackButton.offClick(back)
  }, [route])

  const stamp = useCallback((id: PlaceId) => {
    if (stamps.has(id)) return
    add(id)
    haptic.success()
    confetti(document.querySelector('.play'))
    if (stamps.size + 1 === PLACES.length) setTimeout(() => confetti(document.body, 120), 500)
  }, [add, stamps])

  let page
  switch (route.page) {
    case 'place':
      page = <PlacePage place={placeById[route.id]} seen={seen} stamps={stamps} onStamp={() => stamp(route.id)} />
      break
    case 'games':
      page = <GamesPage />
      break
    case 'game': {
      const place = GAMES[route.id].place
      page = <GamePage id={route.id} onStamp={() => place && stamp(place)} />
      break
    }
    case 'passport':
      page = <PassportPage seen={seen} stamps={stamps} fresh={fresh} />
      break
    default:
      page = <DiscoverPage seen={seen} stamps={stamps} />
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main key={href(route)} className="wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {page}
        </motion.main>
      </AnimatePresence>
      <TabBar route={route} badge={stamps.size} />
    </MotionConfig>
  )
}
