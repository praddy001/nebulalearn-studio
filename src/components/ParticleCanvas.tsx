import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleCanvasProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  speed?: number;
  connectDistance?: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  className = '',
  particleCount = 80,
  colors = ['#6B21B6', '#06B6D4', '#FF7A59'],
  speed = 0.5,
  connectDistance = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return particles;
  }, [particleCount, colors, speed]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const particles = particlesRef.current;
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectDistance) {
          const opacity = (1 - distance / connectDistance) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(107, 33, 182, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      // Mouse interaction
      const mdx = particles[i].x - mouseRef.current.x;
      const mdy = particles[i].y - mouseRef.current.y;
      const mDistance = Math.sqrt(mdx * mdx + mdy * mdy);
      
      if (mDistance < 150) {
        const force = (150 - mDistance) / 150;
        particles[i].vx += (mdx / mDistance) * force * 0.02;
        particles[i].vy += (mdy / mDistance) * force * 0.02;
      }
    }
    
    // Draw particles
    for (const particle of particles) {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = particle.opacity;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Keep base velocity
      if (Math.abs(particle.vx) < 0.1) particle.vx = (Math.random() - 0.5) * speed;
      if (Math.abs(particle.vy) < 0.1) particle.vy = (Math.random() - 0.5) * speed;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    }
  }, [connectDistance, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      drawParticles(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, drawParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-canvas ${className}`}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

export default ParticleCanvas;

