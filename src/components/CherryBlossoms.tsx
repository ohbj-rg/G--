import { useEffect, useRef, useState } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  opacity: number;
  petalType: number;
}

interface CherryBlossomsProps {
  enabled?: boolean;
}

export default function CherryBlossoms({ enabled = true }: CherryBlossomsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(enabled);

  useEffect(() => {
    setIsVisible(enabled);
  }, [enabled]);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate initial petals
    const petalCount = Math.min(28, Math.floor(window.innerWidth / 45));
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 7, // 7px ~ 15px
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 1.5 - 0.5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.4 + 0.5,
        petalType: Math.floor(Math.random() * 3),
      });
    }

    const drawPetal = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      opacity: number,
      type: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();

      // Soft natural cherry blossom petal pink gradients
      ctx.fillStyle =
        type === 0
          ? `rgba(255, 182, 193, ${opacity})` // Light pink
          : type === 1
          ? `rgba(255, 192, 203, ${opacity})` // Sakura pink
          : `rgba(254, 205, 215, ${opacity * 0.9})`; // Deep sakura blush

      // Draw curved cherry blossom petal shape
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.8, -size * 0.6, size * 0.7, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size * 0.7, size * 0.5, -size * 0.8, -size * 0.6, 0, -size);

      ctx.fill();

      // Delicate subtle center vein highlight
      ctx.strokeStyle = `rgba(255, 230, 235, ${opacity * 0.7})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(0, size * 0.4);
      ctx.stroke();

      ctx.restore();
    };

    let swayTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      swayTime += 0.015;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Horizontal sway imitating spring gentle breeze
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(swayTime + i) * 0.8;
        p.angle += p.spin;

        // Wrap around screen boundaries
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(ctx, p.x, p.y, p.size, p.angle, p.opacity, p.petalType);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    />
  );
}
