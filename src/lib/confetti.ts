const COLORS = ['#d0652c', '#ef8a4f', '#2f8f5b', '#0f3442', '#e8c547']

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export function confetti(from: Element | null, count = 40) {
  if (!from || prefersReducedMotion()) return
  const r = from.getBoundingClientRect()
  const x = r.left + r.width / 2
  const y = r.top + r.height / 2
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div')
    c.className = 'confetti'
    c.style.background = COLORS[i % COLORS.length]
    document.body.appendChild(c)
    const a = Math.random() * Math.PI * 2
    const v = 120 + Math.random() * 220
    c.animate(
      [
        { transform: `translate(${x}px,${y}px) rotate(0)`, opacity: 1 },
        { transform: `translate(${x + Math.cos(a) * v}px,${y + Math.sin(a) * v + 260}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ],
      { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' },
    ).onfinish = () => c.remove()
  }
}
