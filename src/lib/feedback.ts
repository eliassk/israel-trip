import { tg } from './telegram'

// Vibration: Telegram's haptics inside the Mini App, the Vibration API elsewhere (Android browsers).
const vibrate = (ms: number | number[]) => navigator.vibrate?.(ms)

export const buzz = {
  light: () => (tg ? tg.HapticFeedback.impactOccurred('light') : vibrate(10)),
  heavy: () => (tg ? tg.HapticFeedback.impactOccurred('heavy') : vibrate(30)),
  error: () => (tg ? tg.HapticFeedback.notificationOccurred('error') : vibrate([30, 40, 30])),
  success: () => (tg ? tg.HapticFeedback.notificationOccurred('success') : vibrate([20, 30, 60])),
}
