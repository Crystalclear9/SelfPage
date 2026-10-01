import { useEffect, useRef } from 'react';

export default function PetalTrail({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(pointer: fine)');
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let particles = [], frame = 0, previous = 0, lastSpawn = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; particles = []; ctx.clearRect(0, 0, innerWidth, innerHeight); };
    const draw = (now) => {
      const dt = Math.min((now - previous) / 16.67 || 1, 3); previous = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.x += p.vx * dt; p.y += p.vy * dt; p.angle += .035 * dt; p.life -= .018 * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.max(p.life, 0) * .48;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.bezierCurveTo(p.size, -p.size, p.size, p.size * .5, 0, p.size); ctx.bezierCurveTo(-p.size, p.size * .5, -p.size, -p.size, 0, -p.size); ctx.fill(); ctx.restore();
      }
      frame = particles.length ? requestAnimationFrame(draw) : 0;
    };
    const move = (e) => {
      if (!enabled || media.matches || !fine.matches || e.pointerType === 'touch' || document.hidden) return;
      const now = performance.now(); if (now - lastSpawn < 40) return; lastSpawn = now;
      particles.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * 1.6, vy: .6 + Math.random(), life: 1, angle: Math.random() * 6, size: 2 + Math.random() * 2, color: ['#dd879f', '#eaa6ba', '#d77292'][Math.floor(Math.random() * 3)] });
      if (particles.length > 30) particles.shift();
      if (!frame) { previous = now; frame = requestAnimationFrame(draw); }
    };
    const visibility = () => { if (document.hidden) stop(); };
    resize(); window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', visibility); media.addEventListener('change', stop);
    return () => { stop(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', stop); };
  }, [enabled]);
  return <canvas ref={ref} className="petal-canvas" aria-hidden="true" />;
}
