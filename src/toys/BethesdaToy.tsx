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
  const [splash, setSplash] = useState(0)
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
      setSplash(n)
      arm()
      return
    }
    setRipple(false)
    setHealed(true)
    setMsg('Nie musisz być pierwszy. Jezus mówi: „Wstań, weź łoże swoje i chodź!” (J 5,8)')
    onDone()
  }

  return (
    <Stage background="#e9d9b6" message={msg} height={280}>
      <svg className="pool__scene" viewBox="0 0 400 240" preserveAspectRatio="xMinYMin slice" aria-hidden="true">
        <defs>
          <linearGradient id="pool-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc7cf" /><stop offset="1" stopColor="#4f97a6" /></linearGradient>
        </defs>
        {/* Portico: Bethesda had five colonnades round its pools (J 5,2). */}
        <rect width="400" height="240" fill="#efe2c2" />
        <rect y="0" width="400" height="16" fill="#d8c393" />
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <path d={`M${i * 80 - 40} 70 a40 40 0 0 1 80 0`} fill="none" stroke="#cdb582" strokeWidth="6" />
            <rect x={i * 80 + 32} y="16" width="16" height="78" fill="#d9c694" />
            <rect x={i * 80 + 28} y="16" width="24" height="7" fill="#c4ab76" />
            <rect x={i * 80 + 28} y="90" width="24" height="6" fill="#c4ab76" />
          </g>
        ))}
        {/* Stone porch where the sick lay, then the basin with its steps. */}
        <rect y="96" width="400" height="144" fill="#d6c294" />
        <path d="M0 96 H400" stroke="#bda874" strokeWidth="2" />
        <rect x="128" y="112" width="264" height="74" rx="4" fill="#bca46e" />
        {[0, 1, 2].map(i => <rect key={i} x={128 + i * 8} y={112 + i * 7} width={264 - i * 8} height="6" fill={i % 2 ? '#c9b37f' : '#b29a64'} />)}
        <rect x="152" y="133" width="236" height="49" rx="3" fill="url(#pool-water)" />
        <path d="M160 146 q12 -4 24 0 t24 0 M250 160 q12 -4 24 0 t24 0 M190 172 q12 -4 24 0 t24 0" stroke="rgba(255,255,255,.35)" strokeWidth="2" fill="none" />
        {ripple && [0, 1, 2].map(i => <ellipse key={i} className="pool__ripple" cx="230" cy="158" rx="28" ry="8" style={{ animationDelay: `${i * 0.4}s` }} />)}
        {splash > 0 && <circle key={splash} className="pool__splash" cx="330" cy="150" r="12" />}
        {/* Other sick people waiting along the edge. */}
        <g fill="#8a6a4a"><circle cx="356" cy="104" r="6" /><path d="M346 112 h20 l-2 -4 h-16z" /></g>
        <rect x="336" y="106" width="34" height="5" rx="2" fill="#b07a5a" opacity=".7" />
        <g fill="#6f5640"><circle cx="300" cy="104" r="6" /></g>
        <rect x="282" y="106" width="34" height="5" rx="2" fill="#7a8fa0" opacity=".7" />
        {/* You, on your mat, facing the water. */}
        {healed ? (
          <g className="pool__healed">
            <rect x="30" y="96" width="12" height="46" rx="4" fill="#b8956a" transform="rotate(-12 36 119)" />
            <path d="M58 140 L56 176 M70 140 L74 176" stroke="#b07850" strokeWidth="6" strokeLinecap="round" />
            <path d="M52 108 Q64 102 76 108 L80 146 Q64 150 48 146Z" fill="#e8dcc4" />
            <path d="M54 114 L42 128 M74 114 L88 96" stroke="#b07850" strokeWidth="5" strokeLinecap="round" />
            <circle cx="64" cy="94" r="10" fill="#b07850" /><path d="M54 92 a10 10 0 0 1 20 0 q-10 -5 -20 0z" fill="#3b2a1a" />
          </g>
        ) : (
          <g>
            {/* Sick for 38 years (J 5,5): pale and thin under a worn blanket, head on a rolled cloak. */}
            <rect x="10" y="164" width="112" height="8" rx="3" fill="#b8956a" />
            <rect x="14" y="152" width="22" height="13" rx="6" fill="#9c8a6c" />
            <path d="M44 166 C48 150 64 148 74 152 C82 146 96 148 104 158 L112 158 L112 166Z" fill="#8f8a7c" />
            <path d="M74 152 C80 156 84 160 86 166 M58 151 C62 156 64 160 64 166" stroke="#77725f" strokeWidth="1.5" fill="none" />
            <path d="M110 154 q6 -1 8 4 q-2 4 -8 4z" fill="#d9bfa4" />
            <path d="M52 154 Q64 150 76 155" stroke="#d9bfa4" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="77" cy="155" r="3" fill="#d9bfa4" />
            <path d="M38 158 h8" stroke="#d9bfa4" strokeWidth="6" strokeLinecap="round" />
            <circle cx="32" cy="148" r="9" fill="#d9bfa4" />
            <path d="M23 147 a9 9 0 0 1 12 -8 q-4 4 -12 8z" fill="#6b5a4a" />
            <path d="M23 148 q-1 6 4 9 l1 -4z" fill="#6b5a4a" />
            <path d="M39 144 l3 3 -3 1" fill="#c9ab90" />
            <path d="M34 145 q2 1 4 0" stroke="#6b5040" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M33 153 q2 1 4 0" stroke="#9a7a66" strokeWidth="1.2" fill="none" />
          </g>
        )}
      </svg>
      {healed && <div className="pool__light" />}
      {!healed && <button className="btn pool__btn" onClick={jump}>Wskakuję! ({tries}/{TRIES})</button>}
    </Stage>
  )
}
