import { useEffect, useRef } from "react"

type ParticleKind = "dot" | "cross" | "streak"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  kind: ParticleKind
  color: [number, number, number]
}

const MAX_PARTICLES = 300

function randomInRange(min: number, max: number): number {
  return (Math.random() * (max - min)) + min
}

function pickKind(): ParticleKind {
  const value = Math.random()
  if (value < 0.56) {
    return "dot"
  }
  if (value < 0.84) {
    return "cross"
  }
  return "streak"
}

function pickColor(): [number, number, number] {
  const palette: [number, number, number][] = [
    [125, 190, 255],
    [151, 208, 255],
    [111, 167, 255],
    [184, 221, 255],
  ]
  return palette[Math.floor(Math.random() * palette.length)]
}

export function ParticleCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext("2d")
    if (!context) {
      return
    }

    const particles: Particle[] = []
    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      targetX: window.innerWidth * 0.5,
      targetY: window.innerHeight * 0.5,
      active: false,
    }

    let width = 0
    let height = 0
    let raf = 0
    let previousTime = performance.now()
    let lastScrollY = window.scrollY

    const resize = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = (count: number, boost = 1, spread = 18) => {
      for (let index = 0; index < count; index += 1) {
        const particle: Particle = {
          x: pointer.targetX + randomInRange(-spread, spread),
          y: pointer.targetY + randomInRange(-spread, spread),
          vx: randomInRange(-1.35, 1.35) * boost,
          vy: randomInRange(-1.2, 1.2) * boost,
          life: randomInRange(20, 48),
          maxLife: randomInRange(20, 48),
          size: randomInRange(1.1, 3.2),
          kind: pickKind(),
          color: pickColor(),
        }
        particles.push(particle)
      }

      while (particles.length > MAX_PARTICLES) {
        particles.shift()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX
      pointer.targetY = event.clientY
      pointer.active = true
      spawn(6, 1.18, 14)
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onPointerDown = () => {
      spawn(18, 1.75, 32)
    }

    const onScroll = () => {
      const nextY = window.scrollY
      const delta = nextY - lastScrollY
      lastScrollY = nextY
      const intensity = Math.abs(delta)
      if (intensity < 0.5) {
        return
      }

      const count = Math.min(14, Math.floor((intensity * 0.22) + 3))
      const speed = 1 + Math.min(1.65, intensity * 0.018)
      spawn(count, speed, 26)
    }

    const drawParticle = (particle: Particle, alpha: number) => {
      const [r, g, b] = particle.color
      context.save()
      context.translate(particle.x, particle.y)
      context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.86})`
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.72})`
      context.lineWidth = 1.05

      if (particle.kind === "dot") {
        context.beginPath()
        context.arc(0, 0, particle.size, 0, Math.PI * 2)
        context.fill()
      } else if (particle.kind === "cross") {
        const size = particle.size * 1.8
        context.beginPath()
        context.moveTo(-size, 0)
        context.lineTo(size, 0)
        context.moveTo(0, -size)
        context.lineTo(0, size)
        context.stroke()
      } else {
        const w = particle.size * 0.85
        const h = particle.size * 2.6
        context.rotate(Math.atan2(particle.vy, particle.vx) + (Math.PI / 2))
        context.fillRect(-w * 0.5, -h, w, h)
      }

      context.restore()
    }

    const render = (time: number) => {
      const dt = Math.min((time - previousTime) / 16.667, 2.2)
      previousTime = time

      pointer.x += (pointer.targetX - pointer.x) * 0.18
      pointer.y += (pointer.targetY - pointer.y) * 0.18

      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = "lighter"

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        particle.life -= dt
        if (particle.life <= 0) {
          particles.splice(index, 1)
          continue
        }

        particle.vx *= 0.985
        particle.vy *= 0.986
        particle.vy += 0.012 * dt
        particle.x += particle.vx * dt
        particle.y += particle.vy * dt

        const alpha = Math.max(0, particle.life / particle.maxLife)
        drawParticle(particle, alpha)
      }

      const aura = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 145)
      aura.addColorStop(0, "rgba(134, 193, 255, 0.24)")
      aura.addColorStop(0.45, "rgba(116, 170, 255, 0.12)")
      aura.addColorStop(1, "rgba(116, 170, 255, 0)")
      context.fillStyle = aura
      context.beginPath()
      context.arc(pointer.x, pointer.y, 145, 0, Math.PI * 2)
      context.fill()

      const pulse = 18 + (Math.sin(time * 0.0062) * 4)
      context.strokeStyle = pointer.active
        ? "rgba(164, 213, 255, 0.62)"
        : "rgba(164, 213, 255, 0.28)"
      context.lineWidth = 1.1
      context.beginPath()
      context.arc(pointer.x, pointer.y, pulse, 0, Math.PI * 2)
      context.stroke()

      for (let index = 0; index < 3; index += 1) {
        const angle = (time * 0.0016) + ((Math.PI * 2 * index) / 3)
        const orbitX = pointer.x + (Math.cos(angle) * (pulse + 9))
        const orbitY = pointer.y + (Math.sin(angle) * (pulse + 9))
        context.fillStyle = "rgba(196, 230, 255, 0.6)"
        context.fillRect(orbitX - 1, orbitY - 1, 2, 2)
      }

      context.globalCompositeOperation = "source-over"
      raf = requestAnimationFrame(render)
    }

    resize()
    spawn(24, 1.4, 120)
    raf = requestAnimationFrame(render)

    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerleave", onPointerLeave)
    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerleave", onPointerLeave)
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-cursor" aria-hidden="true" />
}
