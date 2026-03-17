import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TARGET = "neverfakee's portfolio";
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!?<>[]{}+-=/*";

function randChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

type Phase = "scramble" | "hold" | "split" | "gone";

export function IntroScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("scramble");
  const [chars, setChars] = useState<string[]>(() =>
    Array.from({ length: TARGET.length }, randChar),
  );
  const [locked, setLocked] = useState(0);
  const lockedRef = useRef(0);
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // ── Scramble RAF loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "scramble") return;

    const loop = (ts: number) => {
      if (ts - lastTickRef.current > 38) {
        lastTickRef.current = ts;
        setChars((prev) =>
          prev.map((_c, i) => (i < lockedRef.current ? TARGET[i] : randChar())),
        );
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  // ── Lock chars one-by-one ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "scramble") return;

    if (locked >= TARGET.length) {
      setPhase("hold");
      return;
    }

    const delay = 55 + Math.random() * 75;
    const t = setTimeout(() => {
      lockedRef.current = locked + 1;
      setLocked((l) => l + 1);
    }, delay);

    return () => clearTimeout(t);
  }, [phase, locked]);

  // ── Hold → Split ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => setPhase("split"), 820);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Split → Gone ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "split") return;
    const t = setTimeout(() => {
      setPhase("gone");
      onDoneRef.current();
    }, 1050);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  const splitting = phase === "split";

  return (
    <div className="intro" aria-hidden="true">
      {/* ── Left curtain panel ───────────────────────────────────────── */}
      <motion.div
        className="intro__panel intro__panel--left"
        initial={false}
        animate={splitting ? { x: "-100%" } : { x: "0%" }}
        transition={{ duration: 0.88, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* halo lives on the right edge of this panel */}
        <div className="intro__halo intro__halo--left" />
      </motion.div>

      {/* ── Right curtain panel ──────────────────────────────────────── */}
      <motion.div
        className="intro__panel intro__panel--right"
        initial={false}
        animate={splitting ? { x: "100%" } : { x: "0%" }}
        transition={{ duration: 0.88, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* halo lives on the left edge of this panel */}
        <div className="intro__halo intro__halo--right" />
      </motion.div>

      {/* ── Scramble text (sits above both panels) ───────────────────── */}
      <motion.div
        className="intro__text-wrap"
        animate={
          splitting
            ? { opacity: 0, y: -18, scale: 0.94 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.38 }}
      >
        {/* top label */}
        <div className="intro__eyebrow">
          {["W", "E", "L", "C", "O", "M", "E"].map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: phase === "scramble" && locked < 3 ? 0 : 0.55,
              }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              {l}
            </motion.span>
          ))}
        </div>

        {/* main scrambled title */}
        <div className="intro__title">
          {chars.map((char, i) => (
            <span
              key={i}
              className={
                i < locked
                  ? "intro__char intro__char--locked"
                  : "intro__char intro__char--scramble"
              }
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* bottom scan line */}
        <motion.div
          className="intro__scanline"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: locked >= TARGET.length ? 1 : locked / TARGET.length,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* ── Subtle grid overlay ──────────────────────────────────────── */}
      <div className="intro__grid" />
    </div>
  );
}
