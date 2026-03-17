import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function MouseGlow() {
  const pointerX = useMotionValue(-200)
  const pointerY = useMotionValue(-200)
  const softX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.8 })
  const softY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.8 })
  const coreX = useSpring(pointerX, { stiffness: 260, damping: 28, mass: 0.45 })
  const coreY = useSpring(pointerY, { stiffness: 260, damping: 28, mass: 0.45 })

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
    }

    window.addEventListener('pointermove', handleMove)

    return () => {
      window.removeEventListener('pointermove', handleMove)
    }
  }, [pointerX, pointerY])

  return (
    <>
      <motion.div className="cursor-glow cursor-glow--large" style={{ x: softX, y: softY }} />
      <motion.div className="cursor-glow cursor-glow--small" style={{ x: coreX, y: coreY }} />
    </>
  )
}
