import { useEffect, useRef, useState } from 'react'
import type { ToyProps } from '.'
import { Stage } from './Stage'

// The player can never win the race to the water. That is the point of the story.
const TRIES = 3

export function BethesdaToy({ onDone }: ToyProps) {
  const [ripple, setRipple] = useState(false)
  const [tries, setTries] = useState(0)
  const [msg, setMsg] = useState('Czekaj, aż woda się poruszy. Wtedy wskakuj!')
  const [healed, setHealed] = useState(false)
  const timer = useRef<number>()

  const arm = () => {
    setRipple(false)
    timer.current = window.setTimeout(() => setRipple(true), 1200 + Math.random() * 2200)
  }
  useEffect(() => {
    arm()
    return () => clearTimeout(timer.current)
  }, [])

  const jump = () => {
    if (healed) return
    if (!ripple) return setMsg('Za wcześnie! Woda jeszcze stoi.')
    const n = tries + 1
    setTries(n)
    clearTimeout(timer.current)
    if (n < TRIES) {
      setMsg(['Ktoś wskoczył przed tobą!', 'Znowu ktoś był szybszy…'][n - 1])
      arm()
      return
    }
    setRipple(false)
    setHealed(true)
    setMsg('Nie musisz być pierwszy. Jezus mówi: „Wstań, weź łoże swoje i chodź!” (J 5,8)')
    onDone()
  }

  return (
    <Stage background="linear-gradient(#e9d9b6 0 30%, #7fb9c4 30%)" message={msg}>
      <div className="pool__columns">{Array.from({ length: 5 }, (_, i) => <span key={i} />)}</div>
      {ripple && [0, 1, 2].map(i => <div key={i} className="pool__ripple" style={{ animationDelay: `${i * 0.4}s` }} />)}
      {healed && <div className="pool__light" />}
      <div className="sprite pool__you">{healed ? '🚶' : '🧎'}</div>
      {!healed && <button className="btn pool__btn" onClick={jump}>Wskakuję! ({tries}/{TRIES})</button>}
    </Stage>
  )
}
