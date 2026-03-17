import { useEffect, useEffectEvent, useRef } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { InteractivePanel } from "./InteractivePanel"
import type { AccentTone, ShowcaseReel } from "../data/portfolio"

type ScrollScrubVideoProps = {
  reel: ShowcaseReel
  index: number
}

function clampProgress(value: number): number {
  return Math.min(0.999, Math.max(0.001, value))
}

function accentClass(accent: AccentTone): string {
  switch (accent) {
    case "ice":
      return "reel-section--ice"
    case "signal":
      return "reel-section--signal"
    default:
      return "reel-section--steel"
  }
}

function syncVideoFrame(video: HTMLVideoElement | null, progress: number) {
  if (!video) {
    return
  }

  const duration = video.duration
  if (!Number.isFinite(duration) || duration <= 0) {
    return
  }

  const targetTime = duration * clampProgress(progress)
  if (Math.abs(video.currentTime - targetTime) < 0.04) {
    return
  }

  video.pause()
  video.currentTime = targetTime
}

function Layer({
  className,
  progress,
  offsetX,
  offsetY,
}: {
  className: string
  progress: MotionValue<number>
  offsetX: [number, number]
  offsetY: [number, number]
}) {
  const x = useTransform(progress, [0, 1], offsetX)
  const y = useTransform(progress, [0, 1], offsetY)

  return <motion.span className={className} style={{ x, y }} />
}

export function ScrollScrubVideo({ reel, index }: ScrollScrubVideoProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const latestProgress = useRef(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const syncLatestFrame = useEffectEvent(() => {
    syncVideoFrame(videoRef.current, latestProgress.current)
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    latestProgress.current = latest
    syncVideoFrame(videoRef.current, latest)
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const handleReady = () => {
      syncLatestFrame()
    }

    video.addEventListener("loadedmetadata", handleReady)
    video.addEventListener("canplay", handleReady)

    return () => {
      video.removeEventListener("loadedmetadata", handleReady)
      video.removeEventListener("canplay", handleReady)
    }
  }, [syncLatestFrame])

  const copyY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [56, 0, -56],
  )
  const mediaY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [80, 0, -80],
  )
  const mediaRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [index % 2 === 0 ? -7 : 7, 0, index % 2 === 0 ? 3 : -3],
  )
  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    reduceMotion ? [1, 1, 1, 1] : [0.88, 0.95, 1.02, 1.08],
  )
  const previewX = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? [0, 0, 0] : [90, 0, -40],
  )
  const previewY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [42, -12, -58],
  )
  const signalX = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    reduceMotion ? [0, 0, 0] : [-80, 0, 28],
  )
  const signalY = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    reduceMotion ? [0, 0, 0] : [88, 12, -34],
  )
  const floatOpacity = useTransform(scrollYProgress, [0.08, 0.24, 0.92], [0, 1, 0.7])
  const ghostY = useTransform(scrollYProgress, [0, 1], [44, -24])
  const railScale = useTransform(scrollYProgress, [0, 1], [0.08, 1])
  const sectionNumber = String(index + 3).padStart(2, "0")

  return (
    <section ref={sectionRef} className={`reel-section ${accentClass(reel.accent)}`} id={reel.id}>
      <div className="reel-section__sticky">
        <motion.span className="reel-section__ghost" style={{ y: ghostY }}>
          {reel.kicker}
        </motion.span>
        <Layer
          className="reel-section__orb reel-section__orb--one"
          progress={scrollYProgress}
          offsetX={[-20, 24]}
          offsetY={[28, -28]}
        />
        <Layer
          className="reel-section__orb reel-section__orb--two"
          progress={scrollYProgress}
          offsetX={[18, -18]}
          offsetY={[-16, 24]}
        />

        <div className={`reel-section__layout${index % 2 === 1 ? " is-reversed" : ""}`}>
          <motion.div className="reel-section__copy" style={{ y: copyY }}>
            <span className="reel-section__index">{sectionNumber}</span>
            <span className="section-label">{reel.kicker}</span>
            <h2>{reel.title}</h2>
            <p>{reel.description}</p>

            <ul className="reel-section__bullets">
              {reel.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

            <div className="reel-section__stats">
              {reel.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="reel-section__media-wrap"
            style={{ y: mediaY, rotate: mediaRotate, scale: cardScale }}
          >
            <div className="reel-section__rail" aria-hidden="true">
              <motion.span className="reel-section__rail-fill" style={{ scaleY: railScale }} />
            </div>
            <InteractivePanel className="reel-section__media glass-panel">
              <div className="reel-section__hud">
                <span>{reel.kicker}</span>
                <span>Scroll-driven playback</span>
              </div>

              <video
                ref={videoRef}
                className="reel-section__video"
                src={reel.video}
                poster={reel.poster}
                muted
                playsInline
                preload="auto"
                aria-label={reel.title}
              />

              <div className="reel-section__timeline">
                <motion.span
                  className="reel-section__timeline-fill"
                  style={{ scaleX: scrollYProgress }}
                />
              </div>
            </InteractivePanel>

            <motion.div className="reel-section__depth reel-section__depth--back" style={{ y: mediaY }} />
            <motion.div className="reel-section__depth reel-section__depth--front" style={{ x: copyY }} />

            <motion.div
              className="reel-section__float-card reel-section__float-card--preview glass-panel"
              style={{ x: previewX, y: previewY, opacity: floatOpacity }}
            >
              <img src={reel.poster} alt="" aria-hidden="true" className="reel-section__float-image" />
              <div>
                <span>Still frame</span>
                <strong>{reel.kicker}</strong>
              </div>
            </motion.div>

            <motion.div
              className="reel-section__float-card reel-section__float-card--signal glass-panel"
              style={{ x: signalX, y: signalY, opacity: floatOpacity }}
            >
              <span>Live notes</span>
              <strong>{reel.stats[0]}</strong>
              <div className="reel-section__signal-bars" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
