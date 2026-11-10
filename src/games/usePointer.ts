import type { Point } from './types'

/** Position of a pointer event relative to the element that handles it. */
export const pointIn = (e: React.PointerEvent<HTMLElement>): Point => {
  const r = e.currentTarget.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}
