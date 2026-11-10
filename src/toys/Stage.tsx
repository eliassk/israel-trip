import type { CSSProperties, ReactNode, Ref } from 'react'

interface Props {
  background: string
  message?: ReactNode
  height?: number
  style?: CSSProperties
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  stageRef?: Ref<HTMLDivElement>
  children?: ReactNode
}

export function Stage({ background, message, height = 240, style, onClick, stageRef, children }: Props) {
  return (
    <div className="stage" ref={stageRef} style={{ background, height, ...style }} onClick={onClick}>
      {children}
      {message != null && <div className="stage__msg">{message}</div>}
    </div>
  )
}
