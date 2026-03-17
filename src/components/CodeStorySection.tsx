import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { InteractivePanel } from "./InteractivePanel"
import { MagneticButton } from "./MagneticButton"
import type { CodeLine, MotionGalleryItem, ShowcaseReel } from "../data/portfolio"

type CodeStorySectionProps = {
  reel: ShowcaseReel
  lines: CodeLine[]
  gallery: MotionGalleryItem[]
}

function TypedLine({
  line,
  index,
  progress,
}: {
  line: CodeLine
  index: number
  progress: MotionValue<number>
}) {
  const start = 0.1 + (index * 0.065)
  const end = start + 0.24
  const reveal = useTransform(progress, [start, end], [0, 1], { clamp: true })
  const opacity = useTransform(reveal, [0, 0.12, 1], [0.08, 0.45, 1])
  const y = useTransform(reveal, [0, 1], [18, 0])
  const clipPath = useTransform(reveal, (value) => {
    const hidden = Math.max(0, 100 - (value * 100))
    return `inset(0 ${hidden}% 0 0 round 14px)`
  })

  return (
    <motion.div className={`typed-line typed-line--${line.tone ?? "default"}`} style={{ opacity, y, clipPath }}>
      <span className="typed-line__number">{line.lineNumber}</span>
      <span className="typed-line__text">{line.text}</span>
    </motion.div>
  )
}

export function CodeStorySection({ reel, lines, gallery }: CodeStorySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const copyY = useTransform(scrollYProgress, [0, 0.4, 1], [72, 0, -62])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0.28])
  const panelY = useTransform(scrollYProgress, [0, 0.45, 1], [120, 0, -80])
  const panelRotate = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -3])
  const panelScale = useTransform(scrollYProgress, [0, 0.4, 0.9], [0.9, 1, 1.04])
  const previewX = useTransform(scrollYProgress, [0, 0.38, 1], [140, 0, -54])
  const previewY = useTransform(scrollYProgress, [0, 0.4, 1], [48, -12, -78])
  const imageY = useTransform(scrollYProgress, [0, 0.55, 1], [110, 0, -38])
  const boardX = useTransform(scrollYProgress, [0, 0.5, 1], [90, 0, -34])
  const boardY = useTransform(scrollYProgress, [0, 0.6, 1], [56, 0, -44])
  const ghostY = useTransform(scrollYProgress, [0, 1], [48, -36])
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 0.18, 0.12, 0])

  return (
    <section ref={sectionRef} id="engine" className="code-story">
      <div className="code-story__sticky">
        <div className="code-story__backdrop" aria-hidden="true" />
        <div className="code-story__beam" aria-hidden="true" />
        <motion.span className="code-story__ghost" style={{ y: ghostY, opacity: ghostOpacity }}>
          BUILD LOGIC
        </motion.span>

        <div className="code-story__layout">
          <motion.div className="code-story__copy" style={{ y: copyY, opacity: copyOpacity }}>
            <span className="code-story__index">02</span>
            <span className="section-label">Code scene</span>
            <h2>Then the screen goes dark and the build logic starts surfacing line by line.</h2>
            <p>
              This section is the handoff after the cinematic opener: plugin code typing in,
              layered cards sliding through depth, and supporting visuals that make the engineering
              feel as alive as the effects.
            </p>

            <div className="code-story__actions">
              <MagneticButton href="#showcase" variant="primary">
                Keep scrolling
              </MagneticButton>
              <MagneticButton href="#clients" variant="secondary">
                See client work
              </MagneticButton>
            </div>

            <div className="code-story__chips">
              <span>Java / Paper / Spigot</span>
              <span>Particles + abilities</span>
              <span>Discord bridge hooks</span>
            </div>
          </motion.div>

          <div className="code-story__scene">
            <motion.div
              className="code-story__panel-wrap"
              style={{ y: panelY, rotate: panelRotate, scale: panelScale }}
            >
              <InteractivePanel className="code-panel glass-panel">
                <div className="code-panel__top">
                  <span>{reel.title}</span>
                  <span>ParticleEngine.java</span>
                </div>

                <div className="code-panel__body">
                  {lines.map((line, index) => (
                    <TypedLine key={line.lineNumber} line={line} index={index} progress={scrollYProgress} />
                  ))}
                </div>

                <div className="code-panel__status">
                  <span>typing with scroll energy</span>
                  <span>build ready / hooks connected</span>
                </div>
              </InteractivePanel>
            </motion.div>

            <motion.div className="code-story__preview-card glass-panel" style={{ x: previewX, y: previewY }}>
              <div className="floating-media__label">Live preview</div>
              <video
                className="floating-media__video"
                src={reel.video}
                poster={reel.poster}
                muted
                playsInline
                autoPlay
                loop
                preload="metadata"
                aria-label={`${reel.title} preview`}
              />
              <div className="floating-media__copy">
                <strong>{reel.kicker}</strong>
                <span>Real plugin footage floating beside the typing panel.</span>
              </div>
            </motion.div>

            <motion.div className="code-story__image-card glass-panel" style={{ y: imageY }}>
              <img src={gallery[0].src} alt={gallery[0].alt} className="floating-media__image" />
              <div className="floating-media__copy">
                <strong>{gallery[0].title}</strong>
                <span>{gallery[0].caption}</span>
              </div>
            </motion.div>

            <motion.div className="code-story__board glass-panel" style={{ x: boardX, y: boardY }}>
              <span className="floating-media__label">Asset wall</span>
              <div className="code-story__board-grid">
                {gallery.slice(1).map((item) => (
                  <div key={item.title} className="code-story__board-tile">
                    <img src={item.src} alt={item.alt} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.caption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
