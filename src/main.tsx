import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { initTelegram, tgStartParam } from './lib/telegram'

initTelegram()
// A shared link opens the Mini App with `startapp=gry-polow`; Telegram only allows [A-Za-z0-9_-], so the path uses dashes.
if (tgStartParam && !location.hash) location.hash = '#/' + tgStartParam.replace(/-/g, '/')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
