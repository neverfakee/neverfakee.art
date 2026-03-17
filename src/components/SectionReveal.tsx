import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type SectionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
  once?: boolean
  y?: number
}

export function SectionReveal({
  children,
  className = '',
  delay = 0,
  amount = 0.24,
  once = false,
  y = 72,
}: SectionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.965, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
