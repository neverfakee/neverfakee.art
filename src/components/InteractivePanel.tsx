import type { PointerEvent, PropsWithChildren } from 'react'

type InteractivePanelProps = PropsWithChildren<{
  className?: string
}>

function resetPanel(element: HTMLDivElement) {
  element.style.setProperty('--spotlight-x', '50%')
  element.style.setProperty('--spotlight-y', '50%')
  element.style.setProperty('--rotate-x', '0deg')
  element.style.setProperty('--rotate-y', '0deg')
}

export function InteractivePanel({ children, className = '' }: InteractivePanelProps) {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateX = ((y / rect.height) - 0.5) * -8
    const rotateY = ((x / rect.width) - 0.5) * 10

    element.style.setProperty('--spotlight-x', `${x}px`)
    element.style.setProperty('--spotlight-y', `${y}px`)
    element.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`)
    element.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    resetPanel(event.currentTarget)
  }

  return (
    <div
      className={`interactive-panel ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  )
}
