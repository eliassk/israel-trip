import { useCallback, useState } from 'react'
import type { PlaceId } from '../data/places'
import { load, save } from '../lib/storage'

export function useStamps() {
  const [stamps, setStamps] = useState<Set<PlaceId>>(() => new Set(load<PlaceId[]>('stamps', [])))
  const [fresh, setFresh] = useState<PlaceId | null>(null)

  const add = useCallback((id: PlaceId) => {
    setStamps(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev).add(id)
      save('stamps', [...next])
      return next
    })
    setFresh(id)
  }, [])

  return { stamps, fresh, add }
}
