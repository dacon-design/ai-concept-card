'use client';

import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  life: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
}

interface ThanosSnapProps {
  targetRef: React.RefObject<HTMLElement>;
  isActive: boolean;
  onComplete: () => void;
}

export default function ThanosSnap({ targetRef, isActive, onComplete }: ThanosSnapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isActive && targetRef.current) {
      startDisintegration();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Restore visibility when unmounting/cleaning up
      if (targetRef.current) {
        targetRef.current.style.visibility = '';
      }
    };
  }, [isActive]);

  const startDisintegration = async () => {
    if (!targetRef.current || !containerRef.current) return;

    try {
      // 1. Capture the element
      const sourceCanvas = await html2canvas(targetRef.current, {
        backgroundColor: null,
        scale: 1, // 1:1 scale is sufficient for this effect
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // 2. Set up the animation canvas
      const animCanvas = canvasRef.current;
      if (!animCanvas) return;

      const rect = targetRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Position container exactly over the element
      containerRef.current.style.left = `${rect.left}px`;
      containerRef.current.style.top = `${rect.top}px`;
      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.height = `${height}px`;

      // Canvas needs to be larger to allow particles to float up/out
      // We'll give it some padding
      const padding = 100;
      animCanvas.width = width + padding * 2;
      animCanvas.height = height + padding * 2;
      animCanvas.style.transform = `translate(-${padding}px, -${padding}px)`;

      const ctx = animCanvas.getContext('2d');
      if (!ctx) return;

      // 3. Create particles
      // User requested 30x20 grid
      const cols = 30;
      const rows = 20;
      const particleW = width / cols;
      const particleH = height / rows;

      const particles: Particle[] = [];
      
      // Get pixel data from source canvas
      const sourceCtx = sourceCanvas.getContext('2d');
      if (!sourceCtx) return;

      const sourceData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
      const sourceW = sourceCanvas.width;
      const sourceH = sourceCanvas.height;

      // Map grid to source pixels
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            // Calculate center position of this grid cell
            const x = c * particleW;
            const y = r * particleH;
            
            // Sample color from the center of the block
            const sampleX = Math.floor(x + particleW / 2);
            const sampleY = Math.floor(y + particleH / 2);
            
            // Ensure bounds
            if (sampleX >= sourceW || sampleY >= sourceH) continue;
            
            const i = (sampleY * sourceW + sampleX) * 4;
            const alpha = sourceData[i + 3];
            
            if (alpha > 20) { // Only create particles for visible pixels
                particles.push({
                    x: x + padding, // Offset by padding on the animation canvas
                    y: y + padding,
                    w: particleW,
                    h: particleH,
                    vx: (Math.random() - 0.5) * 2, // Random X velocity
                    vy: (Math.random() - 1) * 2 - 1, // Upward Y velocity (range -1 to -3)
                    color: `rgba(${sourceData[i]}, ${sourceData[i+1]}, ${sourceData[i+2]}, ${alpha/255})`,
                    life: 1.0,
                    decay: Math.random() * 0.02 + 0.01, // Random decay 0.01 - 0.03
                    rotation: 0,
                    rotationSpeed: (Math.random() - 0.5) * 0.2
                });
            }
        }
      }

      // Hide the original element now that we're ready to animate
      if (targetRef.current) {
        targetRef.current.style.visibility = 'hidden';
      }

      // 4. Animation Loop
      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);
        
        let activeParticles = false;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            if (p.life > 0) {
                activeParticles = true;
                
                // Physics
                p.x += p.vx;
                p.y += p.vy;
                p.vy -= 0.05; // Float up (Buoyancy)
                
                p.rotation += p.rotationSpeed;
                p.life -= p.decay;

                // Draw
                ctx.save();
                ctx.translate(p.x + p.w/2, p.y + p.h/2);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
                ctx.restore();
            }
        }

        if (activeParticles) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            onComplete();
        }
      };

      animate();

    } catch (error) {
      console.error('Error in ThanosSnap:', error);
      onComplete();
    }
  };

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed z-[9999] pointer-events-none"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}