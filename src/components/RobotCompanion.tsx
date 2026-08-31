import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, MessageSquare, Lightbulb, X, HelpCircle, Bot, ChevronRight, Zap, RefreshCw } from 'lucide-react';

export type RobotMood = 'happy' | 'curious' | 'excited' | 'thinking' | 'waving' | 'sleeping';

interface RobotCompanionProps {
  userName?: string;
  currentView?: string;
  activeBranch?: string;
  onOpenJdModal?: () => void;
  onOpenCommitModal?: () => void;
  onOpenBranchManager?: () => void;
  onOpenOnboarding?: () => void;
  onNavigateLanding?: () => void;
}

export const RobotCompanion: React.FC<RobotCompanionProps> = ({
  userName = 'there',
  currentView = 'landing',
  activeBranch = 'main',
  onOpenJdModal,
  onOpenCommitModal,
  onOpenBranchManager,
  onOpenOnboarding,
  onNavigateLanding
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [robotPos, setRobotPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [mood, setMood] = useState<RobotMood>('happy');
  const [speechText, setSpeechText] = useState<string>('');
  const [isSpeechOpen, setIsSpeechOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const robotRef = useRef<HTMLDivElement>(null);

  const tips = [
    `Welcome! I am Byte, your ResumeFlow scribe. Everything is centered around YOUR real career story!`,
    `Branching tip: Keep your 'main' branch as your single source of truth, then fork role-specific branches!`,
    `Did you know? Our ATS matching is grounded—it highlights keyword gaps without making up fake claims.`,
    `Save version snapshots (commits) after major achievements so you can roll back or diff anytime!`,
    `You can switch between your custom resume and sample engineering profiles whenever you like.`
  ];

  // Mouse tracking & smooth following without fleeing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (isFollowing && !isHovered) {
        // Calculate distance from cursor to robot center
        if (robotRef.current) {
          const rect = robotRef.current.getBoundingClientRect();
          const robotCenterX = rect.left + rect.width / 2;
          const robotCenterY = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - robotCenterX, e.clientY - robotCenterY);

          // If the user moves cursor towards the robot to interact with it (dist < 140px),
          // freeze robot in place so it NEVER runs away or evades the cursor!
          if (dist < 140) {
            return;
          }
        }

        // Smooth trailing follow (behind cursor with safe screen bounds)
        setRobotPos(prev => {
          const targetX = Math.min(Math.max(e.clientX + 30, 20), window.innerWidth - 220);
          const targetY = Math.min(Math.max(e.clientY + 20, 20), window.innerHeight - 200);
          return {
            x: prev.x + (targetX - prev.x) * 0.08,
            y: prev.y + (targetY - prev.y) * 0.08
          };
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFollowing, isHovered]);

  // Set contextual speech based on view and user
  useEffect(() => {
    if (currentView === 'landing') {
      setSpeechText(`Hi! I'm Byte. Ready to turn your resume into a Git-powered career engine? Let's get onboarded!`);
      setMood('waving');
    } else if (currentView === 'onboarding') {
      setSpeechText(`Great! Let's build your resume around YOU. Take your time entering your real identity.`);
      setMood('happy');
    } else if (currentView === 'editor') {
      setSpeechText(`Hey ${userName}! You're in the Master Editor on branch '${activeBranch}'. Edit your blocks below!`);
      setMood('curious');
    } else if (currentView === 'diff') {
      setSpeechText(`4-Level Semantic Diff: Compare any two versions to see exact added, deleted, or altered skills!`);
      setMood('thinking');
    } else if (currentView === 'preview') {
      setSpeechText(`Looking sharp! Inspect the print-ready typography and export your high-contrast PDF.`);
      setMood('excited');
    }
  }, [currentView, userName, activeBranch]);

  // Calculate eye look angles towards mouse
  const calculateEyeOffset = () => {
    if (!robotRef.current) return { x: 0, y: 0 };
    const rect = robotRef.current.getBoundingClientRect();
    const robotCenterX = rect.left + rect.width / 2;
    const robotCenterY = rect.top + rect.height / 2;

    const deltaX = mousePos.x - robotCenterX;
    const deltaY = mousePos.y - robotCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance === 0) return { x: 0, y: 0 };
    const maxOffset = 3.5;
    return {
      x: (deltaX / distance) * maxOffset,
      y: (deltaY / distance) * maxOffset
    };
  };

  const eyeOffset = calculateEyeOffset();

  const nextTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (tipIndex + 1) % tips.length;
    setTipIndex(nextIdx);
    setSpeechText(tips[nextIdx]);
    setMood('excited');
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 bg-[#121212] text-[#F4F1EA] px-3.5 py-2 border border-[#121212] shadow-[3px_3px_0px_0px_#121212] hover:bg-[#2A2A2A] transition-all cursor-pointer text-xs font-sans font-bold uppercase tracking-wider"
          title="Wake up Byte (Resume Companion)"
        >
          <Bot className="w-4 h-4 text-[#946B12]" />
          <span>Byte Assistant</span>
          <span className="w-2 h-2 bg-[#264634] rounded-full animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={robotRef}
      onMouseEnter={() => {
        setIsHovered(true);
        setMood('excited');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setMood('happy');
      }}
      style={
        isFollowing
          ? {
              position: 'fixed',
              left: `${robotPos.x}px`,
              top: `${robotPos.y}px`,
              pointerEvents: 'auto',
              transition: isHovered ? 'none' : 'left 0.05s ease-out, top 0.05s ease-out'
            }
          : undefined
      }
      className={`${
        isFollowing ? '' : 'fixed bottom-5 right-5'
      } z-50 flex flex-col items-end select-none`}
    >
      {/* Speech Bubble */}
      {isSpeechOpen && (
        <div className="mb-2 max-w-xs md:max-w-sm bg-[#FAF8F5] border border-[#121212] p-3 shadow-[4px_4px_0px_0px_#121212] relative animate-fadeIn text-xs text-[#121212]">
          <div className="flex items-start justify-between gap-2 border-b border-[#121212]/10 pb-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] font-bold uppercase px-1 py-0.2 bg-[#121212] text-[#F4F1EA]">
                BYTE // COMPANION
              </span>
              <span className="text-[10px] font-editorial-body italic text-[#121212]/70">
                {mood === 'thinking' ? 'Analyzing...' : mood === 'excited' ? 'Eureka!' : 'Online'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={nextTip}
                className="p-0.5 text-[#121212]/70 hover:text-[#121212] hover:bg-[#EAE6DC]"
                title="Next career tip"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsSpeechOpen(false)}
                className="p-0.5 text-[#121212]/60 hover:text-[#121212]"
                title="Dismiss message"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="font-editorial-body text-[12px] text-[#121212] leading-relaxed italic">
            "{speechText}"
          </p>

          {/* Quick Action Shortcuts inside Speech Bubble */}
          <div className="mt-2.5 pt-2 border-t border-[#121212]/10 flex flex-wrap gap-1.5">
            {currentView === 'landing' ? (
              <button
                onClick={onOpenOnboarding}
                className="px-2 py-1 bg-[#121212] text-[#F4F1EA] text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#2A2A2A] shadow-[1px_1px_0px_0px_#121212] cursor-pointer"
              >
                <span>Start Personal Setup</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            ) : (
              <>
                {onOpenJdModal && (
                  <button
                    onClick={onOpenJdModal}
                    className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F4F1EA] text-[9px] font-sans font-bold uppercase tracking-wider transition-all"
                  >
                    Match JD
                  </button>
                )}
                {onOpenCommitModal && (
                  <button
                    onClick={onOpenCommitModal}
                    className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F4F1EA] text-[9px] font-sans font-bold uppercase tracking-wider transition-all"
                  >
                    Commit Snapshot
                  </button>
                )}
                {onOpenBranchManager && (
                  <button
                    onClick={onOpenBranchManager}
                    className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F4F1EA] text-[9px] font-sans font-bold uppercase tracking-wider transition-all"
                  >
                    Manage Tracks
                  </button>
                )}
              </>
            )}
          </div>

          {/* Speech Bubble Arrow */}
          <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#121212]" />
          <div className="absolute -bottom-[7px] right-8 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#FAF8F5]" />
        </div>
      )}

      {/* The Physical Robot Scribe Avatar */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onMouseEnter={() => {
          setIsHovered(true);
          setMood('excited');
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setMood('happy');
        }}
        onClick={() => {
          setIsSpeechOpen(prev => !prev);
          if (!isSpeechOpen) {
            nextTip({ stopPropagation: () => {} } as any);
          }
        }}
      >
        {/* Robot Controls Drawer (always visible when floating, visible on hover when docked) */}
        <div
          className={`${
            isFollowing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity bg-[#FAF8F5] border border-[#121212] px-2 py-1 shadow-[2px_2px_0px_0px_#121212] flex items-center gap-1.5 text-[9px] font-sans font-bold z-10`}
        >
          <button
            onClick={e => {
              e.stopPropagation();
              setIsFollowing(prev => !prev);
            }}
            className={`px-2 py-0.5 border flex items-center gap-1 cursor-pointer transition-colors ${
              isFollowing
                ? 'bg-[#121212] text-[#F4F1EA] border-[#121212] hover:bg-[#2A2A2A]'
                : 'bg-[#FAF8F5] text-[#121212] border-[#121212] hover:bg-[#EAE6DC]'
            }`}
            title={isFollowing ? 'Click to pin Byte back to the corner' : 'Let Byte follow cursor smoothly'}
          >
            <span>{isFollowing ? '⚓ Dock to Corner' : '✨ Float'}</span>
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="text-[#121212]/70 hover:text-[#121212] px-1 cursor-pointer"
            title="Minimize Byte"
          >
            Hide
          </button>
        </div>

        {/* The Animated SVG Character: Byte */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center filter drop-shadow-[3px_3px_0px_#121212] transition-transform group-hover:scale-105">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{
              transform: `rotate(${Math.min(Math.max(eyeOffset.x * 2, -8), 8)}deg)`,
              transition: 'transform 0.15s ease-out'
            }}
          >
            {/* Antenna with pulsing sphere */}
            <line x1="50" y1="20" x2="50" y2="8" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
            <circle
              cx="50"
              cy="7"
              r="4.5"
              fill={mood === 'excited' ? '#946B12' : '#264634'}
              stroke="#121212"
              strokeWidth="2"
              className={mood === 'excited' ? 'animate-ping' : ''}
            />
            <circle
              cx="50"
              cy="7"
              r="4"
              fill={mood === 'excited' ? '#946B12' : '#264634'}
              stroke="#121212"
              strokeWidth="2"
            />

            {/* Robot Head Body */}
            <rect
              x="20"
              y="20"
              width="60"
              height="52"
              rx="8"
              fill="#FAF8F5"
              stroke="#121212"
              strokeWidth="3.5"
            />

            {/* Ear bolts */}
            <rect x="14" y="38" width="6" height="16" rx="2" fill="#EAE6DC" stroke="#121212" strokeWidth="2.5" />
            <rect x="80" y="38" width="6" height="16" rx="2" fill="#EAE6DC" stroke="#121212" strokeWidth="2.5" />

            {/* Face Screen Visor */}
            <rect
              x="28"
              y="28"
              width="44"
              height="28"
              rx="4"
              fill="#121212"
              stroke="#121212"
              strokeWidth="1.5"
            />

            {/* Left Eye Socket */}
            <circle cx="39" cy="40" r="7" fill="#2A2A2A" />
            {/* Left Pupil (Tracks Cursor) */}
            <circle
              cx={39 + eyeOffset.x}
              cy={40 + eyeOffset.y}
              r="3.5"
              fill={mood === 'excited' ? '#F4F1EA' : '#85B79D'}
              className="transition-transform duration-75"
            />
            {/* Eye Glimmer */}
            <circle cx={38 + eyeOffset.x} cy={39 + eyeOffset.y} r="1.2" fill="#FFFFFF" />

            {/* Right Eye Socket */}
            <circle cx="61" cy="40" r="7" fill="#2A2A2A" />
            {/* Right Pupil (Tracks Cursor) */}
            <circle
              cx={61 + eyeOffset.x}
              cy={40 + eyeOffset.y}
              r="3.5"
              fill={mood === 'excited' ? '#F4F1EA' : '#85B79D'}
              className="transition-transform duration-75"
            />
            {/* Eye Glimmer */}
            <circle cx={60 + eyeOffset.x} cy={39 + eyeOffset.y} r="1.2" fill="#FFFFFF" />

            {/* Mouth Expressions */}
            {mood === 'happy' || mood === 'waving' ? (
              <path
                d="M 42 49 Q 50 54 58 49"
                fill="none"
                stroke="#85B79D"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : mood === 'excited' ? (
              <ellipse cx="50" cy="50" rx="5" ry="3" fill="#85B79D" />
            ) : mood === 'thinking' ? (
              <line x1="44" y1="50" x2="56" y2="48" stroke="#F4F1EA" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <line x1="43" y1="50" x2="57" y2="50" stroke="#85B79D" strokeWidth="2" strokeLinecap="round" />
            )}

            {/* Little Neck Collar */}
            <rect x="38" y="72" width="24" height="6" rx="2" fill="#EAE6DC" stroke="#121212" strokeWidth="2.5" />

            {/* Quilt / Feather Pen Held on Side (Scribe Tool) */}
            <path
              d="M 74 65 L 86 48 C 88 45 92 46 90 50 L 78 72 Z"
              fill="#946B12"
              stroke="#121212"
              strokeWidth="2"
            />
            <path d="M 78 72 L 74 78 L 76 71 Z" fill="#121212" />
          </svg>
        </div>
      </div>
    </div>
  );
};
