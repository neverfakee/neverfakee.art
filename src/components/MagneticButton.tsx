import type { PointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

type MagneticButtonProps = {
  children: ReactNode
  className?: string
  href?: string
  to?: string
  target?: string
  rel?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function MagneticButton({
  children,
  className = '',
  href,
  to,
  target,
  rel,
  variant = 'primary',
}: MagneticButtonProps) {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 240, damping: 18, mass: 0.4 })
  const y = useSpring(pointerY, { stiffness: 240, damping: 18, mass: 0.4 })

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2

    pointerX.set(offsetX * 0.18)
    pointerY.set(offsetY * 0.18)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const buttonClassName = `magnetic-button magnetic-button--${variant}`.trim()
  const normalizedRel = rel ?? (target === '_blank' ? 'noreferrer' : undefined)

  return (
    <motion.div
      className={`magnetic-wrap ${className}`.trim()}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {to ? (
        <Link to={to} className={buttonClassName}>
          {children}
        </Link>
      ) : href ? (
        <a href={href} className={buttonClassName} target={target} rel={normalizedRel}>
          {children}
        </a>
      ) : (
        <button type="button" className={buttonClassName}>
          {children}
        </button>
      )}
    </motion.div>
  )
}
