import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, GitBranch, ShieldCheck, Terminal, Compass } from 'lucide-react';

interface ResumeFlowBottomAnimationProps {
  onStartOnboarding?: () => void;
  onExploreSample?: () => void;
}

interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  colorStart: string;
  colorMid: string;
  colorEnd: string;
  glowColor: string;
  lineWidth: number;
  yOffset: number; // relative offset around centerline (0.0 to 1.0)
  opacity: number;
  direction: number;
}

export const ResumeFlowBottomAnimation: React.FC<ResumeFlowBottomAnimationProps> = ({
  onStartOnboarding,
  onExploreSample
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false
  });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Warm Antique Gold & Forest Pine ribbon wave configurations matching the website's ink-parchment-forest theme
    const waves: WaveConfig[] = [
      {
        amplitude: 36,
        frequency: 0.0022,
        speed: 0.012,
        phase: 0,
        colorStart: 'rgba(229, 195, 120, 0)',
        colorMid: '#E5C378', // Antique Warm Gold
        colorEnd: 'rgba(197, 160, 89, 0)',
        glowColor: 'rgba(229, 195, 120, 0.85)',
        lineWidth: 2.6,
        yOffset: 0.32,
        opacity: 0.95,
        direction: 1
      },
      {
        amplitude: 44,
        frequency: 0.0016,
        speed: 0.009,
        phase: 1.6,
        colorStart: 'rgba(133, 183, 157, 0)',
        colorMid: '#85B79D', // Sage Pine Green
        colorEnd: 'rgba(38, 70, 52, 0)',
        glowColor: 'rgba(133, 183, 157, 0.8)',
        lineWidth: 3.0,
        yOffset: 0.36,
        opacity: 0.9,
        direction: -1
      },
      {
        amplitude: 26,
        frequency: 0.003,
        speed: 0.015,
        phase: 3.1,
        colorStart: 'rgba(245, 230, 190, 0)',
        colorMid: '#F5E6BE', // Champagne Highlight
        colorEnd: 'rgba(229, 195, 120, 0)',
        glowColor: 'rgba(245, 230, 190, 0.95)',
        lineWidth: 1.8,
        yOffset: 0.29,
        opacity: 0.95,
        direction: 1
      },
      {
        amplitude: 52,
        frequency: 0.0013,
        speed: 0.007,
        phase: 4.3,
        colorStart: 'rgba(163, 201, 168, 0)',
        colorMid: '#529971', // Deep Emerald Pine
        colorEnd: 'rgba(38, 70, 52, 0)',
        glowColor: 'rgba(82, 153, 113, 0.65)',
        lineWidth: 2.4,
        yOffset: 0.39,
        opacity: 0.75,
        direction: 1
      },
      {
        amplitude: 20,
        frequency: 0.004,
        speed: 0.019,
        phase: 2.4,
        colorStart: 'rgba(212, 175, 55, 0)',
        colorMid: '#D4AF37', // Metallic Gold Accent
        colorEnd: 'rgba(148, 107, 18, 0)',
        glowColor: 'rgba(212, 175, 55, 0.9)',
        lineWidth: 1.4,
        yOffset: 0.31,
        opacity: 0.95,
        direction: -1
      },
      {
        amplitude: 60,
        frequency: 0.0009,
        speed: 0.005,
        phase: 5.2,
        colorStart: 'rgba(38, 70, 52, 0)',
        colorMid: '#264634', // Deep Forest Base
        colorEnd: 'rgba(18, 18, 18, 0)',
        glowColor: 'rgba(38, 70, 52, 0.5)',
        lineWidth: 3.5,
        yOffset: 0.43,
        opacity: 0.55,
        direction: 1
      }
    ];

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Subtle editorial matrix grid in warm parchment tones
      ctx.fillStyle = 'rgba(244, 241, 234, 0.04)';
      const dotSpacing = 30;
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Render each flow ribbon wave
      waves.forEach((wave, index) => {
        ctx.save();
        ctx.beginPath();

        const baseY = height * wave.yOffset;
        const currentPhase = wave.phase + time * wave.speed * wave.direction;

        // Warm harmonic gradient
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, wave.colorStart);
        grad.addColorStop(0.2, wave.colorMid);
        grad.addColorStop(0.5, wave.colorMid);
        grad.addColorStop(0.8, wave.colorMid);
        grad.addColorStop(1, wave.colorEnd);

        ctx.strokeStyle = grad;
        ctx.lineWidth = wave.lineWidth;
        ctx.globalAlpha = wave.opacity;

        // Warm luminous glow
        ctx.shadowColor = wave.glowColor;
        ctx.shadowBlur = isHovered ? 22 : 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        for (let x = 0; x <= width; x += 4) {
          // Organic compound waveforms
          const s1 = Math.sin(x * wave.frequency + currentPhase);
          const s2 = Math.cos(x * (wave.frequency * 1.5) + currentPhase * 0.75);
          const s3 = Math.sin(x * (wave.frequency * 0.6) - currentPhase * 0.35);

          let y = baseY + (s1 * 0.65 + s2 * 0.25 + s3 * 0.1) * wave.amplitude;

          // Interactive cursor ripple
          if (mousePos.active) {
            const distFromMouse = Math.hypot(x - mousePos.x, y - mousePos.y);
            const maxDist = 200;
            if (distFromMouse < maxDist) {
              const force = (1 - distFromMouse / maxDist) * 28 * Math.sin(time * 0.05 + index);
              y += force;
            }
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, active: false }));
    setIsHovered(false);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#111311] overflow-hidden select-none border-t border-[#264634]/40 text-[#F4F1EA] pt-12 pb-16 min-h-[470px] flex flex-col items-center justify-between"
    >
      {/* Warm ambient radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[300px] bg-gradient-to-r from-[#946B12]/15 via-[#264634]/25 to-[#85B79D]/15 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[180px] bg-gradient-to-t from-[#111311] via-[#111311]/85 to-transparent z-10 pointer-events-none" />

      {/* Top Editorial Metadata Line */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 text-center">
        <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#A3B39E] flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-[#E5C378]" />
          Semantic Document Calculus
        </span>
        <span className="text-[#3E4A3B] text-xs hidden sm:inline">•</span>
        <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#A3B39E] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#85B79D]" />
          Single Canonical Master
        </span>
        <span className="text-[#3E4A3B] text-xs hidden sm:inline">•</span>
        <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#A3B39E] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F5E6BE]" />
          4-Level Semantic Diff
        </span>
        <span className="text-[#3E4A3B] text-xs hidden sm:inline">•</span>
        <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#E5C378] underline decoration-[#946B12] decoration-dotted underline-offset-4 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
          Verifiable Career Trajectory
        </span>
      </div>

      {/* Animated Glowing Wave Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Refined Calligraphic Display Typography matching the editorial serif style */}
      <div className="relative z-10 my-auto w-full px-4 text-center pointer-events-none mt-3 sm:mt-5">
        <h2
          className="font-calligraphy-display font-light italic tracking-normal leading-[0.9] text-[20vw] sm:text-[16vw] md:text-[13vw] lg:text-[165px] xl:text-[195px] select-none transform transition-transform duration-500"
          style={{
            background:
              'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 15%, #F5E6BE 35%, #E5C378 60%, #85B79D 85%, rgba(38, 70, 52, 0.15) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter:
              'drop-shadow(0px 8px 32px rgba(229, 195, 120, 0.28)) drop-shadow(0px 0px 65px rgba(38, 70, 52, 0.45))'
          }}
        >
          resumeflow
        </h2>
      </div>

      {/* Cohesive Editorial Action Buttons */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        {onStartOnboarding && (
          <button
            onClick={onStartOnboarding}
            className="px-7 py-3 bg-[#FAF8F5] text-[#121212] hover:bg-[#E5C378] hover:text-[#121212] border border-[#FAF8F5] font-sans font-bold text-xs uppercase tracking-[0.18em] shadow-[0px_4px_20px_rgba(229,195,120,0.3)] transition-all duration-300 hover:shadow-[0px_6px_28px_rgba(229,195,120,0.5)] hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
          >
            <span>Initialize Master Profile</span>
            <ArrowRight className="w-4 h-4 text-[#121212]" />
          </button>
        )}

        {onExploreSample && (
          <button
            onClick={onExploreSample}
            className="px-6 py-3 bg-[#1A221C] hover:bg-[#263529] border border-[#3E6B50]/60 text-[#E5C378] hover:text-[#FAF8F5] font-mono text-xs transition-all flex items-center gap-2 cursor-pointer hover:border-[#85B79D] shadow-[0px_4px_16px_rgba(0,0,0,0.6)]"
          >
            <Terminal className="w-3.5 h-3.5 text-[#85B79D]" />
            <span>checkout sample engineering track</span>
          </button>
        )}
      </div>

      {/* Bottom Editorial Subtext */}
      <div className="relative z-20 mt-6 text-center text-[10px] sm:text-[11px] font-mono text-[#7A8A78] tracking-wide">
        <span>Deterministic Branch Merging • 100% Client-Side Privacy • AST & Semantic Keyword Grounding</span>
      </div>
    </section>
  );
};
