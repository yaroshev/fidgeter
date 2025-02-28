import React, { useState, useEffect, useRef } from 'react';
import { Button, ThemeProps } from '../../types';
import html2canvas from 'html2canvas';

interface ButtonGridProps extends ThemeProps {
  buttons: Button[];
}

export const ButtonGrid: React.FC<ButtonGridProps> = ({ buttons, isDark }) => {
  const [isExploding, setIsExploding] = useState(false);
  const [showDino, setShowDino] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showVortex, setShowVortex] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showNeon, setShowNeon] = useState(false);
  const [showButterflies, setShowButterflies] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const matrixRef = useRef<HTMLCanvasElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);
  const vortexRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isWaveActive) {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isWaveActive]);

  useEffect(() => {
    if (showMatrix && matrixRef.current) {
      const canvas = matrixRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const chars = '01';
      const fontSize = 14;
      const columns = canvas.width / fontSize;
      const drops: number[] = Array(Math.floor(columns)).fill(1);
      
      const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;
        
        drops.forEach((y, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          ctx.fillText(char, x, y * fontSize);
          if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        });
      };
      
      const matrixInterval = setInterval(drawMatrix, 33);
      return () => clearInterval(matrixInterval);
    }
  }, [showMatrix]);

  useEffect(() => {
    if (showRain && rainRef.current) {
      const canvas = rainRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const raindrops: { x: number; y: number; speed: number; length: number }[] = [];
      for (let i = 0; i < 100; i++) {
        raindrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 5 + Math.random() * 10,
          length: 10 + Math.random() * 20
        });
      }

      const drawRain = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = isDark ? '#4F46E5' : '#818CF8';
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';

        raindrops.forEach(drop => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
          }
        });
      };

      const rainInterval = setInterval(drawRain, 16);
      return () => clearInterval(rainInterval);
    }
  }, [showRain, isDark]);

  useEffect(() => {
    if (showVortex && vortexRef.current) {
      const canvas = vortexRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: { x: number; y: number; angle: number; radius: number; speed: number }[] = [];
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * 200,
          speed: 0.01 + Math.random() * 0.02
        });
      }

      const drawVortex = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          p.angle += p.speed;
          p.radius += 0.1;
          if (p.radius > Math.max(canvas.width, canvas.height)) {
            p.radius = 0;
          }

          const x = canvas.width / 2 + Math.cos(p.angle) * p.radius;
          const y = canvas.height / 2 + Math.sin(p.angle) * p.radius;

          ctx.fillStyle = isDark ? 
            `hsla(${(p.angle * 180 / Math.PI) % 360}, 70%, 60%, 0.8)` :
            `hsla(${(p.angle * 180 / Math.PI) % 360}, 70%, 50%, 0.8)`;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      const vortexInterval = setInterval(drawVortex, 16);
      return () => clearInterval(vortexInterval);
    }
  }, [showVortex, isDark]);

  const handleClick = (buttonId: string) => {
    if (buttonId === 'button1' && !isExploding) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 1500);
    } else if (buttonId === 'button2' && !showDino) {
      setShowDino(true);
      setTimeout(() => setShowDino(false), 3000);
    } else if (buttonId === 'button3' && !isGlitching) {
      html2canvas(document.body).then(canvas => {
        const screenImage = canvas.toDataURL();
        document.documentElement.style.setProperty('--screen-image', `url(${screenImage})`);
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 600);
      });
    } else if (buttonId === 'button4') {
      setIsWaveActive(!isWaveActive);
    } else if (buttonId === 'button5') {
      setShowMatrix(!showMatrix);
    } else if (buttonId === 'button6') {
      setShowVortex(!showVortex);
    } else if (buttonId === 'button7' && !showFireworks) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 2000);
    } else if (buttonId === 'button8') {
      setShowNeon(!showNeon);
    } else if (buttonId === 'button9' && !showButterflies) {
      setShowButterflies(true);
      setTimeout(() => setShowButterflies(false), 4000);
    } else if (buttonId === 'button10') {
      setShowRain(!showRain);
    } else if (buttonId === 'button11' && !showPulse) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    } else if (buttonId === 'button12' && !showSparkles) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 2000);
    }
  };

  return (
    <>
      {isExploding && <div className="color-explosion" />}
      {showDino && (
        <div className="dino-container">
          <div className={`dino ${isDark ? 'invert' : ''}`} />
        </div>
      )}
      {isGlitching && (
        <>
          <div className="glitch-background" />
          <div className="glitch-effect" />
        </>
      )}
      {isWaveActive && (
        <div 
          className="wave-effect"
          style={{
            '--mouse-x': `${mousePos.x}%`,
            '--mouse-y': `${mousePos.y}%`
          } as React.CSSProperties}
        />
      )}
      {showMatrix && (
        <canvas
          ref={matrixRef}
          className="fixed inset-0 pointer-events-none z-40"
        />
      )}
      {showVortex && (
        <canvas
          ref={vortexRef}
          className="fixed inset-0 pointer-events-none z-40"
        />
      )}
      {showFireworks && <div className="fireworks" />}
      {showNeon && <div className="neon-glow" />}
      {showButterflies && <div className="butterflies" />}
      {showRain && (
        <canvas
          ref={rainRef}
          className="fixed inset-0 pointer-events-none z-40"
        />
      )}
      {showPulse && <div className="pulse-ring" />}
      {showSparkles && <div className="sparkles" />}
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleClick(button.id)}
            className={`
              relative px-6 py-3 rounded-full
              ${isDark 
                ? 'bg-transparent border-2 border-gray-700 hover:border-transparent' 
                : 'glass'}
              shadow-lg
              transition-all duration-300
              ${isDark ? 'text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]' : 'text-gray-800'}
              hover:scale-105
              font-medium
              min-w-[150px]
              group
              overflow-hidden
              ${isGlitching && button.id === 'button3' ? 'glitch-text' : ''}
              ${isWaveActive && button.id === 'button4' ? 'wave-button' : ''}
              ${showNeon && button.id === 'button8' ? 'neon-button' : ''}
            `}
          >
            {/* Gradient border overlay for dark mode */}
            {isDark && (
              <div className="
                absolute inset-0 
                rounded-full 
                opacity-0 
                group-hover:opacity-100
                transition-all
                duration-300
                before:absolute
                before:inset-0
                before:rounded-full
                before:p-[2px]
                before:bg-gradient-to-r
                before:from-indigo-500
                before:via-purple-500
                before:to-pink-500
                before:content-['']
                after:absolute
                after:inset-[2px]
                after:rounded-full
                after:bg-gray-900
                after:content-['']
              "/>
            )}
            <span className="relative z-10">{button.text}</span>
          </button>
        ))}
      </div>
    </>
  );
}; 