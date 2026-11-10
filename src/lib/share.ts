import { tg } from './telegram'

/**
 * A link to a page of the app, matching where the app is open:
 * inside Telegram a t.me Mini App link (opens straight on that page), otherwise the website.
 */
export async function challengeUrl(path: string): Promise<string> {
  const web = `${location.origin}${location.pathname}#/${path}`
  if (!tg) return web
  try {
    const { telegramApp } = await (await fetch('/api/config')).json()
    // Telegram only allows [A-Za-z0-9_-] in startapp, so the path uses dashes.
    if (telegramApp) return `${telegramApp}?startapp=${path.replace(/\//g, '-')}`
  } catch {
    /* fall back to the website */
  }
  return web
}

export type ShareResult = 'shared' | 'copied' | 'failed'

export async function shareChallenge(text: string, url: string): Promise<ShareResult> {
  if (tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`)
    return 'shared'
  }
  if (navigator.share) {
    try {
      await navigator.share({ text, url })
      return 'shared'
    } catch {
      /* cancelled */
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}
