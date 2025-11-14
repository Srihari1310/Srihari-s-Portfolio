import React, { useRef, useEffect } from 'react';

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[];
    const mouse = { x: -1000, y: -1000 };
    const getSpacing = () => window.innerWidth < 768 ? 60 : 40;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lastScrollY.current = window.scrollY;
    };

    class Dot {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      spring: number;
      friction: number;

      constructor(x: number, y: number) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = 2;
        this.color = 'rgba(34, 211, 238, 0.2)';
        this.spring = 0.06;
        this.friction = 0.85;
      }

      update(mouse: { x: number; y: number; }) {
        const dxMouse = this.x - mouse.x;
        const dyMouse = this.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const maxDistMouse = 150;

        if (distMouse < maxDistMouse) {
          const influence = 1 - (distMouse / maxDistMouse);
          this.size = 2 + 5 * influence;
          this.color = `rgba(103, 232, 249, ${0.4 + 0.6 * influence})`;
        } else {
            this.size += (2 - this.size) * 0.1;
            this.color = 'rgba(34, 211, 238, 0.2)';
        }

        const dxSpring = this.baseX - this.x;
        const dySpring = this.baseY - this.y;
        const ax = dxSpring * this.spring;
        const ay = dySpring * this.spring;

        this.vx += ax;
        this.vy += ay;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      dots = [];
      const spacing = getSpacing();
      const cols = Math.floor(canvas.width / spacing);
      const rows = Math.floor(canvas.height / spacing);
      const offsetX = (canvas.width - cols * spacing) / 2 + spacing / 2;
      const offsetY = (canvas.height - rows * spacing) / 2 + spacing / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push(new Dot(offsetX + i * spacing, offsetY + j * spacing));
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach(dot => {
        dot.update(mouse);
        dot.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    };

    const handleTouchEnd = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    const handleScroll = () => {
      if (!dots) return;
        const scrollDelta = window.scrollY - lastScrollY.current;
        lastScrollY.current = window.scrollY;

        const scrollForce = scrollDelta * 0.4;
        dots.forEach(dot => {
            dot.vy += scrollForce;
        });
    };

    resizeCanvas();
    init();
    animate();

    const onResize = () => {
        resizeCanvas();
        init();
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

export default InteractiveBackground;
