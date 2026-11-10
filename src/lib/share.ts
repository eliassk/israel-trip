import { tg } from './telegram'

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
