import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

type PageShellProps = {
  children: ReactNode
  className?: string
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 42,
    filter: 'blur(18px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.82,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: 'blur(10px)',
    transition: {
      duration: 0.38,
      ease: [0.4, 0, 1, 1],
    },
  },
}

export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <motion.main
      className={`page ${className}`.trim()}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.main>
  )
}
