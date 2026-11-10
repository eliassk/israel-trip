import { PROJECTION } from '../data/mapGeometry'

export { MAP_H, MAP_W } from '../data/mapGeometry'

export type LatLon = [number, number]

const RAD = Math.PI / 180

/** Web Mercator, identical to the projection that drew the country paths. */
export const project = ([lat, lon]: LatLon): [number, number] => [
  PROJECTION.scale * lon * RAD + PROJECTION.tx,
  -PROJECTION.scale * Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2)) + PROJECTION.ty,
]

export const unproject = (x: number, y: number): LatLon => [
  (2 * Math.atan(Math.exp((PROJECTION.ty - y) / PROJECTION.scale)) - Math.PI / 2) / RAD,
  (x - PROJECTION.tx) / PROJECTION.scale / RAD,
]

export function kmBetween([lat1, lon1]: LatLon, [lat2, lon2]: LatLon): number {
  const a = Math.sin(((lat2 - lat1) * RAD) / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(((lon2 - lon1) * RAD) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

export const toPath = (pts: LatLon[], close = false) =>
  pts.map((p, i) => (i ? 'L' : 'M') + project(p).map(v => v.toFixed(1)).join(',')).join('') + (close ? 'Z' : '')

// Lakes and the Jordan are too small for the 1:50m country data, so they are traced here.
export const GALILEE: LatLon[] = [[32.89, 35.58], [32.86, 35.63], [32.78, 35.65], [32.71, 35.63], [32.72, 35.58], [32.8, 35.53], [32.86, 35.54]]
export const DEAD_SEA: LatLon[] = [[31.78, 35.5], [31.75, 35.58], [31.55, 35.56], [31.38, 35.53], [31.3, 35.5], [31.2, 35.45], [31.05, 35.42], [31.05, 35.38], [31.2, 35.4], [31.4, 35.43], [31.6, 35.45], [31.72, 35.48]]
export const JORDAN: LatLon[] = [[32.71, 35.57], [32.5, 35.56], [32.2, 35.55], [31.9, 35.53], [31.78, 35.53]]
