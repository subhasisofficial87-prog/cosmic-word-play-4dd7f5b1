import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number; r: number; a: number; da: number;
}

interface Particle {
  x: number; y: number; r: number; a: number; da: number;
  vx: number; vy: number; hue: number;
}

interface ShootingStar {
  x: number; y: number; len: number; speed: number; angle: number; a: number; life: number; maxLife: number;
}

export default function StarField() {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = document.getElementById('starfield') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Twinkling stars
    const stars: Star[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.01,
    }));

    // Floating particles
    const particles: Particle[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      a: Math.random() * 0.3 + 0.05,
      da: (Math.random() - 0.5) * 0.005,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2 - 0.1,
      hue: [180, 280, 120, 60][Math.floor(Math.random() * 4)],
    }));

    // Shooting stars (spawn occasionally)
    const shootingStars: ShootingStar[] = [];
    let shootTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Stars
      for (const s of stars) {
        s.a += s.da;
        if (s.a > 1 || s.a < 0.15) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${s.a})`;
        ctx.fill();
      }

      // Floating particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.da;
        if (p.a > 0.35 || p.a < 0.03) p.da *= -1;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.a})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Shooting stars
      shootTimer++;
      if (shootTimer > 180 + Math.random() * 300) {
        shootTimer = 0;
        shootingStars.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.3,
          len: 40 + Math.random() * 60,
          speed: 4 + Math.random() * 4,
          angle: Math.PI / 6 + Math.random() * 0.3,
          a: 1,
          life: 0,
          maxLife: 30 + Math.random() * 20,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life++;
        ss.a = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;
        const g = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        g.addColorStop(0, `rgba(200, 220, 255, 0)`);
        g.addColorStop(1, `rgba(200, 220, 255, ${ss.a * 0.8})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="starfield" className="stars" />;
}
