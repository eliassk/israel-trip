// Telegram Mini App integration. Every helper is a no-op when the app runs in a normal browser.

interface TelegramUser { id: number; first_name: string; last_name?: string; username?: string }

interface WebApp {
  initData: string
  initDataUnsafe: { user?: TelegramUser }
  ready(): void
  expand(): void
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  openTelegramLink(url: string): void
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void }
  HapticFeedback: { impactOccurred(style: 'light' | 'medium' | 'heavy'): void; notificationOccurred(type: 'success' | 'error' | 'warning'): void }
}

declare global {
  interface Window { Telegram?: { WebApp?: WebApp } }
}

const raw = window.Telegram?.WebApp
/** Set only inside Telegram. The script also defines WebApp in a normal browser, but with empty initData. */
export const tg: WebApp | null = raw && raw.initData ? raw : null

export const tgUser = tg?.initDataUnsafe.user ?? null

/** The name shown in rankings: @username, or the first name for users without one. */
export const tgName = tgUser ? (tgUser.username ? `@${tgUser.username}` : tgUser.first_name) : null

const toHex = (rgb: string) => {
  const m = rgb.match(/\d+/g)
  return m ? '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('') : null
}

export function initTelegram() {
  if (!tg) return
  document.documentElement.classList.add('in-telegram')
  tg.ready()
  tg.expand()
  const bg = toHex(getComputedStyle(document.body).backgroundColor)
  if (bg) {
    tg.setHeaderColor(bg)
    tg.setBackgroundColor(bg)
  }
}

export const haptic = {
  tap: () => tg?.HapticFeedback.impactOccurred('light'),
  success: () => tg?.HapticFeedback.notificationOccurred('success'),
}
