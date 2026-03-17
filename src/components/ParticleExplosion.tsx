import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";

type Particle = {
  // current position
  x: number;
  y: number;
  // velocity
  vx: number;
  vy: number;
  // target (star point)
  tx: number;
  ty: number;
  // size of the square
  size: number;
  // color channels
  r: number;
  g: number;
  b: number;
  alpha: number;
  pulseOffset: number;
  // rotation of the square
  rot: number;
  rotSpeed: number;
};

// Build star-shape target positions
function starPoint(
  i: number,
  total: number,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
): { x: number; y: number } {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  const r = i % 2 === 0 ? outerR : innerR;
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r,
  };
}

// Colors: Minecraft particle palette (glowing whites, yellows, greens, purples, blues)
const PALETTE: [number, number, number][] = [
  [255, 255, 180], // bright yellow-white
  [200, 255, 200], // lime green
  [180, 230, 255], // ice blue
  [255, 200, 255], // purple-pink
  [255, 255, 255], // pure white
  [160, 255, 160], // green
  [200, 180, 255], // lavender
  [255, 240, 120], // gold
  [120, 220, 255], // bright blue
  [255, 180, 100], // orange glow
];

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function buildParticles(cx: number, cy: number, count: number): Particle[] {
  const POINTS = 5; // 5-pointed star
  const outerR = Math.min(cx, cy) * 0.55;
  const innerR = outerR * 0.42;
  const totalStarPoints = POINTS * 2;

  return Array.from({ length: count }, (_, i) => {
    // Spread particles along the star perimeter
    const starIdx = i % totalStarPoints;
    const nextIdx = (starIdx + 1) % totalStarPoints;
    const t =
      (i / count) * totalStarPoints - Math.floor((i / count) * totalStarPoints);

    const a = starPoint(starIdx, totalStarPoints, cx, cy, outerR, innerR);
    const b = starPoint(nextIdx, totalStarPoints, cx, cy, outerR, innerR);

    // Interpolate along star edge
    const tx = a.x + (b.x - a.x) * t;
    const ty = a.y + (b.y - a.y) * t;

    const [r, g, b2] = PALETTE[Math.floor(Math.random() * PALETTE.length)];

    return {
      // Start scattered randomly around screen
      x: rand(cx - cx * 0.9, cx + cx * 0.9),
      y: rand(cy - cy * 0.9, cy + cy * 0.9),
      vx: rand(-1.2, 1.2),
      vy: rand(-1.2, 1.2),
      tx,
      ty,
      size: rand(3, 7),
      r,
      g,
      b: b2,
      alpha: rand(0.7, 1.0),
      pulseOffset: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.04, 0.04),
    };
  });
}

export function ParticleExplosion() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      progressRef.current = Math.max(0, Math.min(1, v));
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      sizeRef.current = { w, h };
      // Rebuild particles centred on new size
      particlesRef.current = buildParticles(w / 2, h / 2, 220);
    };

    setSize();
    window.addEventListener("resize", setSize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const REPEL = 140;
    let last = 0;

    const draw = (ts: number) => {
      const dt = Math.min((ts - last) / 16, 3);
      last = ts;

      const { w, h } = sizeRef.current;
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const progress = progressRef.current;
      // How much particles are attracted to the star shape (0 = scattered, 1 = formed)
      // Start forming at progress 0.25, fully formed by 0.65
      const formStrength = Math.max(0, Math.min(1, (progress - 0.2) / 0.45));
      const cx = w / 2;
      const cy = h / 2;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      // Ambient glow behind the star
      if (formStrength > 0) {
        const glowR = 60 + formStrength * 220;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        grd.addColorStop(0, `rgba(200, 240, 120, ${0.08 * formStrength})`);
        grd.addColorStop(0.5, `rgba(160, 220, 80, ${0.04 * formStrength})`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pull toward star target
        const toTx = p.tx - p.x;
        const toTy = p.ty - p.y;
        const distToTarget = Math.sqrt(toTx * toTx + toTy * toTy);

        if (distToTarget > 1) {
          const pull = formStrength * 0.09 * dt;
          p.vx += toTx * pull;
          p.vy += toTy * pull;
        }

        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < REPEL && md > 0) {
          const force = ((REPEL - md) / REPEL) * 7 * dt;
          p.vx += (mdx / md) * force;
          p.vy += (mdy / md) * force;
        }

        // Natural wander when not formed
        if (formStrength < 1) {
          p.vx += (Math.random() - 0.5) * 0.08 * (1 - formStrength) * dt;
          p.vy += (Math.random() - 0.5) * 0.08 * (1 - formStrength) * dt;
        }

        // Speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpd = formStrength > 0.5 ? 4 + (1 - formStrength) * 3 : 3;
        if (spd > maxSpd) {
          p.vx = (p.vx / spd) * maxSpd;
          p.vy = (p.vy / spd) * maxSpd;
        }

        // Damping — stronger when formed so particles settle
        const damp = formStrength > 0.6 ? 0.82 : 0.91;
        p.vx *= damp;
        p.vy *= damp;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Wrap edges (only when not formed)
        if (formStrength < 0.3) {
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        // Rotation
        p.rot += p.rotSpeed * dt;

        // Pulse brightness
        const pulse = Math.sin(ts * 0.002 + p.pulseOffset) * 0.2 + 0.8;
        const alpha = Math.min(1, p.alpha * pulse * (0.6 + formStrength * 0.4));
        const nearMouse = md < REPEL * 0.8;
        const finalAlpha = nearMouse ? Math.min(1, alpha + 0.3) : alpha;

        const sz = p.size * (0.9 + formStrength * 0.6) * pulse;

        // Draw Minecraft-style square particle (rotated)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        // Outer glow
        const glowSize = sz * 3.5;
        const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        pg.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${finalAlpha * 0.7})`);
        pg.addColorStop(0.5, `rgba(${p.r},${p.g},${p.b},${finalAlpha * 0.25})`);
        pg.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Solid square core (Minecraft style)
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${finalAlpha})`;
        ctx.fillRect(-sz / 2, -sz / 2, sz, sz);

        // Bright inner highlight (top-left of square, like Minecraft)
        ctx.fillStyle = `rgba(255,255,255,${finalAlpha * 0.55})`;
        ctx.fillRect(-sz / 2, -sz / 2, sz * 0.45, sz * 0.45);

        ctx.restore();
      }

      // Connection lines when formed
      if (formStrength > 0.3) {
        const lineDist = 55 * formStrength;
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < lineDist * lineDist) {
              const d = Math.sqrt(d2);
              const la = (1 - d / lineDist) * 0.35 * formStrength;
              ctx.strokeStyle = `rgba(220, 255, 160, ${la})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Mouse ring
      if (mouse.x > 0) {
        const mg = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          REPEL * 0.4,
          mouse.x,
          mouse.y,
          REPEL,
        );
        mg.addColorStop(0, "rgba(200,255,160,0.07)");
        mg.addColorStop(1, "rgba(200,255,160,0)");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, REPEL, 0, Math.PI * 2);
        ctx.fillStyle = mg;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="particle-explosion-section">
      <div className="particle-explosion__sticky">
        <canvas
          ref={canvasRef}
          className="particle-explosion__canvas"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
