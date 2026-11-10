import type { Route } from '../lib/router'
import { href } from '../lib/router'

const TABS: { route: Route; label: string; match: Route['page'][]; icon: JSX.Element }[] = [
  {
    route: { page: 'discover' }, label: 'Odkrywaj', match: ['discover', 'place'],
    icon: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zm0 0v14m6-12v14" />,
  },
  {
    route: { page: 'games' }, label: 'Gry', match: ['games', 'game'],
    icon: <path d="M6 9h4M8 7v4m7-1h.01M18 12h.01M7 5h10a4 4 0 0 1 4 4v4a3 3 0 0 1-5.2 2L14 13h-4l-1.8 2A3 3 0 0 1 3 13V9a4 4 0 0 1 4-4z" />,
  },
  {
    route: { page: 'passport' }, label: 'Paszport', match: ['passport'],
    icon: <path d="M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm5.5 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9 17h5" />,
  },
]

export function TabBar({ route, badge }: { route: Route; badge: number }) {
  return (
    <nav className="tabbar" aria-label="Nawigacja">
      {TABS.map(t => {
        const on = t.match.includes(route.page)
        return (
          <a key={t.label} href={href(t.route)} className="tabbar__tab" aria-current={on ? 'page' : undefined}>
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
            <span>{t.label}</span>
            {t.route.page === 'passport' && badge > 0 && <span className="tabbar__badge">{badge}</span>}
          </a>
        )
      })}
    </nav>
  )
}
