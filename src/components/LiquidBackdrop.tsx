import { motion } from 'framer-motion'

const blobs = [
  {
    className: 'liquid-backdrop__blob liquid-backdrop__blob--one',
    animate: { x: ['-5%', '7%', '-3%'], y: ['0%', '12%', '-6%'], scale: [1, 1.12, 0.96, 1] },
    transition: { duration: 18, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const, repeatType: 'mirror' as const },
  },
  {
    className: 'liquid-backdrop__blob liquid-backdrop__blob--two',
    animate: { x: ['4%', '-8%', '6%'], y: ['-4%', '10%', '-2%'], scale: [0.92, 1.08, 1] },
    transition: { duration: 22, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const, repeatType: 'mirror' as const },
  },
  {
    className: 'liquid-backdrop__blob liquid-backdrop__blob--three',
    animate: { x: ['0%', '6%', '-7%'], y: ['5%', '-8%', '8%'], scale: [1, 1.1, 0.94, 1] },
    transition: { duration: 20, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const, repeatType: 'mirror' as const },
  },
]

export function LiquidBackdrop() {
  return (
    <div className="liquid-backdrop" aria-hidden="true">
      {blobs.map((blob) => (
        <motion.span
          key={blob.className}
          className={blob.className}
          animate={blob.animate}
          transition={blob.transition}
        />
      ))}
      <div className="liquid-backdrop__grid" />
    </div>
  )
}
