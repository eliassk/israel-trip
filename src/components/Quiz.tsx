import { useState } from 'react'
import type { Place } from '../data/places'

interface Props { quiz: NonNullable<Place['quiz']>; solved: boolean; onSolve: () => void }

export function Quiz({ quiz, solved, onSolve }: Props) {
  const [wrong, setWrong] = useState<{ i: number; n: number } | null>(null)
  const [right, setRight] = useState(solved)
  return (
    <div className="quiz">
      <span className="quiz__q">{quiz.question}</span>
      {quiz.answers.map((a, i) => {
        const ok = right && i === quiz.correct
        const bad = wrong?.i === i
        return (
          <button key={wrong && bad ? `${i}-${wrong.n}` : i} className={ok ? 'quiz__a quiz__a--ok' : bad ? 'quiz__a quiz__a--bad' : 'quiz__a'}
            onClick={() => {
              if (i === quiz.correct) { setRight(true); onSolve() }
              else setWrong(w => ({ i, n: (w?.n ?? 0) + 1 }))
            }}>
            {a}
          </button>
        )
      })}
    </div>
  )
}
