import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ShowcaseReel } from "../data/portfolio";

type HeroStat = {
  value: string;
  label: string;
};

type CinematicHeroProps = {
  reel: ShowcaseReel;
  tags: string[];
  stats: HeroStat[];
};

function clampProgress(value: number): number {
  return Math.min(0.999, Math.max(0.001, value));
}

function syncVideoFrame(video: HTMLVideoElement | null, progress: number) {
  if (!video) return;

  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;

  const targetTime = duration * clampProgress(progress);
  if (Math.abs(video.currentTime - targetTime) < 0.04) return;

  video.pause();
  video.currentTime = targetTime;
}

export function CinematicHero({ reel, tags, stats }: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const latestProgress = useRef(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    latestProgress.current = latest;
    syncVideoFrame(videoRef.current, latest);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      syncVideoFrame(video, latestProgress.current);
    };

    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("canplay", handleReady);

    return () => {
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("canplay", handleReady);
    };
  }, []);

  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.52, 0.86],
    reduceMotion ? [1, 1, 1] : [0.84, 1.07, 1.34],
  );
  const cardY = useTransform(
    scrollYProgress,
    [0, 0.7],
    reduceMotion ? [0, 0] : [28, -62],
  );
  const topWordX = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-36, 34],
  );
  const bottomWordX = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [44, -32],
  );
  const wordsOpacity = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [0.78, 0.46, 0.12],
  );
  const uiOpacity = useTransform(scrollYProgress, [0, 0.62, 0.8], [1, 1, 0]);
  const uiY = useTransform(
    scrollYProgress,
    [0, 0.66],
    reduceMotion ? [0, 0] : [0, -36],
  );
  const blackoutOpacity = useTransform(
    scrollYProgress,
    [0.62, 0.78, 0.9],
    [0, 0.84, 1],
  );
  const blackoutY = useTransform(
    scrollYProgress,
    [0.62, 0.9],
    reduceMotion ? [0, 0] : [130, 0],
  );
  const handoffOpacity = useTransform(
    scrollYProgress,
    [0.74, 0.9, 0.97],
    [0, 1, 0.84],
  );
  const handoffY = useTransform(
    scrollYProgress,
    [0.74, 0.9],
    reduceMotion ? [0, 0] : [86, -12],
  );

  return (
    <section ref={sectionRef} id="top" className="cinematic-hero">
      <div className="cinematic-hero__sticky">
        <div className="cinematic-hero__base" aria-hidden="true" />

        <motion.h1
          className="cinematic-hero__word cinematic-hero__word--top"
          style={{ x: topWordX, opacity: wordsOpacity }}
        >
          NEVERFAKEE
        </motion.h1>
        <motion.h1
          className="cinematic-hero__word cinematic-hero__word--bottom"
          style={{ x: bottomWordX, opacity: wordsOpacity }}
        >
          PARTICLES
        </motion.h1>

        <div className="cinematic-hero__card-stage">
          <motion.div
            className="cinematic-hero__card-wrap"
            style={{ scale: cardScale, y: cardY }}
          >
            <div className="cinematic-hero__card">
              <div className="cinematic-hero__card-bar">
                <span>{reel.kicker}</span>
              </div>

              <video
                ref={videoRef}
                className="cinematic-hero__video"
                src={reel.video}
                poster={reel.poster}
                muted
                playsInline
                preload="auto"
                aria-label={reel.title}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="cinematic-hero__ui"
          style={{ opacity: uiOpacity, y: uiY }}
        >
          <div className="cinematic-hero__tag-row">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="cinematic-hero__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="cinematic-hero__stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="cinematic-hero__hint">
            <span>Scroll down: video advances and scales</span>
            <span>Scroll up: video reverses</span>
          </div>
        </motion.div>

        <motion.div
          className="cinematic-hero__blackout"
          style={{ opacity: blackoutOpacity, y: blackoutY }}
        >
          <motion.div
            className="cinematic-hero__handoff"
            style={{ opacity: handoffOpacity, y: handoffY }}
          >
            <h2>
              You're not just paying for a plugin, you're paying for quality
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
