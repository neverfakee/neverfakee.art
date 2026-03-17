import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  offset?: number
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  offset = 48,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <div ref={ref} className={`parallax-image ${className}`.trim()}>
      <motion.img src={src} alt={alt} loading="lazy" style={{ y }} />
    </div>
  )
}
