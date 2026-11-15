"use client";

import SectionHeading from "./SectionHeading";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, CircleDot, Magnet, MoveUpRight, Pause, Play, RotateCcw, Sparkles, Zap } from "lucide-react";

const modes = [
  { id: "attract", label: "Attract", icon: Magnet, description: "Gather a tiny universe around your cursor." },
  { id: "repel", label: "Repel", icon: MoveUpRight, description: "Make waves. Give the particles a little space." },
  { id: "orbit", label: "Orbit", icon: CircleDot, description: "Become the center of a swirling constellation." },
] as const;

type Mode = (typeof modes)[number]["id"];
type Particle = { x: number; y: number; vx: number; vy: number; radius: number; color: number };
const PARTICLE_COUNT = 100;

export default function InteractivePlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });
  const burstRef = useRef(false);
  const fieldRef = useRef({ particles: [] as Particle[], width: 1, height: 1, reset: 0 });
  const [mode, setMode] = useState<Mode>("attract");
  const [paused, setPaused] = useState<boolean | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const reducedMotion = useReducedMotion();
  const isPaused = paused ?? Boolean(reducedMotion);
  const selectedMode = modes.find((item) => item.id === mode)!;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = fieldRef.current.width;
    let height = fieldRef.current.height;
    let frame = 0;
    let lastTime = 0;
    let inView = false;
    let particles = fieldRef.current.reset === resetKey ? fieldRef.current.particles : [];
    fieldRef.current.reset = resetKey;
    let palette: string[] = [];
    let lineColor = "";
    let ink = "";
    let pulse = 0;

    const readTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      palette = dark ? ["#5ee8bc", "#77b4ff", "#b7a3ff"] : ["#087f65", "#2963cf", "#8461c2"];
      lineColor = dark ? "110, 186, 163" : "36, 104, 87";
      ink = dark ? "#8eb9a6" : "#4b6359";
    };
    readTheme();

    const seed = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        radius: 1.5 + Math.random() * 1.8,
        color: i % 3,
      }));
      fieldRef.current.particles = particles;
    };

    const draw = (time: number, update: boolean) => {
      const dt = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
      lastTime = time;
      const target = pointer.current;
      const cx = target.x * width;
      const cy = target.y * height;
      context.clearRect(0, 0, width, height);

      // A quiet coordinate grid gives the particles a sense of scale.
      context.fillStyle = `rgba(${lineColor}, 0.16)`;
      for (let x = 24; x < width; x += 32) {
        for (let y = 24; y < height; y += 32) {
          context.beginPath();
          context.arc(x, y, 0.7, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (update && burstRef.current) {
        for (const p of particles) {
          const angle = Math.atan2(p.y - cy, p.x - cx);
          const force = 5 + Math.random() * 5;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
        burstRef.current = false;
        pulse = 1;
      }

      for (const p of particles) {
        if (update) {
          if (target.active || mode === "orbit") {
            const dx = cx - p.x;
            const dy = cy - p.y;
            const distance = Math.max(Math.hypot(dx, dy), 12);
            const reach = Math.min(width, height) * 0.8;
            const force = Math.max(0, 1 - distance / reach) * 0.28;
            if (mode === "orbit") {
              p.vx += (dx / distance * 0.09 - dy / distance * force * 1.8) * dt;
              p.vy += (dy / distance * 0.09 + dx / distance * force * 1.8) * dt;
            } else {
              const direction = mode === "repel" ? -1 : 1;
              p.vx += dx / distance * force * direction * dt;
              p.vy += dy / distance * force * direction * dt;
            }
          }
          const damping = Math.pow(0.992, dt);
          p.vx *= damping;
          p.vy *= damping;
          const speed = Math.hypot(p.vx, p.vy);
          if (speed > 7) { p.vx *= 7 / speed; p.vy *= 7 / speed; }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.x < p.radius || p.x > width - p.radius) {
            p.vx *= -1;
            p.x = Math.max(p.radius, Math.min(width - p.radius, p.x));
          }
          if (p.y < p.radius || p.y > height - p.radius) {
            p.vy *= -1;
            p.y = Math.max(p.radius, Math.min(height - p.radius, p.y));
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 85) {
            context.strokeStyle = `rgba(${lineColor}, ${(1 - distance / 85) * 0.28})`;
            context.lineWidth = 0.8;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
        context.fillStyle = palette[a.color];
        context.beginPath();
        context.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (target.active || mode === "orbit" || pulse > 0) {
        context.strokeStyle = `rgba(${lineColor}, 0.45)`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(cx, cy, 20 + pulse * 65, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.moveTo(cx - 5, cy); context.lineTo(cx + 5, cy);
        context.moveTo(cx, cy - 5); context.lineTo(cx, cy + 5);
        context.stroke();
      }
      if (update) pulse = Math.max(0, pulse - 0.025 * dt);
      context.fillStyle = ink;
      context.font = "10px monospace";
      context.fillText("FIELD / 01", 20, height - 20);
    };

    const tick = (time: number) => {
      frame = 0;
      if (!inView || isPaused || document.hidden) return;
      draw(time, true);
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      draw(performance.now(), false);
      if (inView && !isPaused && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const oldWidth = width;
      const oldHeight = height;
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      fieldRef.current.width = width;
      fieldRef.current.height = height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!particles.length) seed();
      else particles.forEach((p) => { p.x *= width / oldWidth; p.y *= height / oldHeight; });
      resume();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      resume();
    });
    intersectionObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => { readTheme(); resume(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", resume);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", resume);
    };
  }, [mode, isPaused, resetKey]);

  const burst = () => {
    burstRef.current = true;
    setPaused(false);
  };

  return (
    <section id='playground' className='section-band playground-section'>
      <div className='section-wrap section-space'>
        <SectionHeading number='07' eyebrow='Made for curiosity' title='Serious about the work. Playful by nature.' description='A small interactive experiment. Take a moment, move things around, and see what happens.' />
        <div className='section-shell rounded-3xl overflow-hidden'>
          <div className='grid lg:grid-cols-[260px_minmax(0,1fr)]'>
            <div className='p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-[color:var(--border)] flex flex-col'>
              <div className='flex items-center gap-2 mb-6'>
                <span className='inline-flex rounded-lg inset-panel p-2 text-[color:var(--primary)]'><Sparkles size={18} /></span>
                <span className='font-[var(--font-display)] text-lg'>Make a little magic.</span>
              </div>
              <p className='text-xs uppercase tracking-widest text-[color:var(--muted)] mb-3'>Choose your force</p>
              <div className='grid grid-cols-3 lg:grid-cols-1 gap-2' role='group' aria-label='Particle force'>
                {modes.map(({ id, label, icon: Icon }) => (
                  <button key={id} type='button' aria-pressed={mode === id} onClick={() => setMode(id)}
                    className={`particle-mode flex items-center justify-center lg:justify-start gap-2 rounded-xl px-3 py-3 text-sm font-medium ${mode === id ? "particle-mode-active" : ""}`}>
                    <Icon size={17} /> {label}
                  </button>
                ))}
              </div>
              <p className='text-sm leading-relaxed text-[color:var(--muted)] mt-4 min-h-10' aria-live='polite'>{selectedMode.description}</p>
              <div className='mt-6 lg:mt-auto lg:pt-10'>
                <button type='button' onClick={burst} className='primary-action w-full rounded-xl py-3 px-4 inline-flex justify-center items-center gap-2 text-sm font-semibold'>
                  <Zap size={16} /> Send a burst
                </button>
                <div className='flex gap-2 mt-2'>
                  <button type='button' onClick={() => setPaused(!isPaused)} aria-pressed={isPaused}
                    className='particle-mode flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm'>
                    {isPaused ? <Play size={14} /> : <Pause size={14} />} {isPaused ? "Play" : "Pause"}
                  </button>
                  <button type='button' onClick={() => { pointer.current = { x: 0.5, y: 0.5, active: false }; burstRef.current = false; setResetKey((key) => key + 1); }}
                    className='particle-mode flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm'>
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>
            </div>

            <div className='min-w-0'>
              <div className='flex items-center justify-between gap-3 px-5 py-4 border-b border-[color:var(--border)]'>
                <span className='text-xs tracking-widest uppercase text-[color:var(--muted)]'>Your tiny universe</span>
                <span className='inline-flex items-center gap-2 text-xs text-[color:var(--primary)]'>
                  <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? "bg-[color:var(--muted)]" : "bg-[color:var(--primary)]"}`} />
                  {isPaused ? "Paused" : "Live"}
                </span>
              </div>
              <canvas ref={canvasRef} tabIndex={0} role='img' aria-label='Interactive particle field' aria-describedby='particle-instructions'
                className='particle-canvas block w-full h-[340px] sm:h-[440px] lg:h-[480px]'
                onPointerMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  pointer.current = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height, active: true };
                }}
                onPointerDown={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  pointer.current = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height, active: true };
                  burst();
                }}
                onPointerLeave={() => { pointer.current.active = false; }}
                onPointerUp={(event) => { if (event.pointerType !== "mouse") pointer.current.active = false; }}
                onPointerCancel={() => { pointer.current.active = false; }}
                onBlur={() => { pointer.current.active = false; }}
                onKeyDown={(event) => {
                  const directions: Record<string, [number, number]> = { ArrowLeft: [-0.05, 0], ArrowRight: [0.05, 0], ArrowUp: [0, -0.05], ArrowDown: [0, 0.05] };
                  if (directions[event.key]) {
                    event.preventDefault();
                    const [dx, dy] = directions[event.key];
                    pointer.current = { x: Math.max(0, Math.min(1, pointer.current.x + dx)), y: Math.max(0, Math.min(1, pointer.current.y + dy)), active: true };
                  } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); burst(); }
                }}>
                Explore particles using the force, burst, pause, and reset controls.
              </canvas>
            </div>
          </div>
          <div className='flex flex-wrap justify-between gap-3 px-5 sm:px-7 py-4 border-t border-[color:var(--border)] text-xs text-[color:var(--muted)]'>
            <p id='particle-instructions' className='inline-flex items-center gap-2'><ArrowDownToLine size={14} className='shrink-0' /> Move or touch to explore. Click to burst. Keyboard: arrows + Enter.</p>
            <span className='font-mono tracking-wide'>100 particles · endless possibilities</span>
          </div>
        </div>
      </div>
    </section>
  );
}
