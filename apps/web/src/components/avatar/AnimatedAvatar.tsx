'use client';

import React from 'react';
import { Bot, Mic, Sparkles, Volume2 } from 'lucide-react';

interface AnimatedAvatarProps {
  state?: 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';
  speechVolume?: number;
}

export function AnimatedAvatar({
  state = 'IDLE',
  speechVolume = 40,
}: AnimatedAvatarProps) {
  const getStatusBadge = () => {
    switch (state) {
      case 'SPEAKING':
        return { label: 'AI Speaking', color: 'bg-emerald-500 text-white', icon: Volume2 };
      case 'LISTENING':
        return { label: 'Listening...', color: 'bg-[#6C63FF] text-white animate-pulse', icon: Mic };
      case 'THINKING':
        return { label: 'Analyzing Response...', color: 'bg-amber-500 text-white animate-bounce', icon: Sparkles };
      default:
        return { label: 'AI Interviewer Ready', color: 'bg-gray-400 text-white', icon: Bot };
    }
  };

  const statusInfo = getStatusBadge();
  const Icon = statusInfo.icon;

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-[32px] neu-card relative overflow-hidden">
      {/* Outer Glowing Audio Spectrum Ring */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Animated Pulse Rings */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-[#6C63FF]/30 transition-all duration-300 ${
            state === 'SPEAKING' || state === 'LISTENING'
              ? 'animate-ping scale-110 opacity-75'
              : ''
          }`}
        />
        <div
          className={`absolute -inset-3 rounded-full border-2 border-[#6C63FF]/20 transition-all duration-500 ${
            state === 'SPEAKING' ? 'scale-125 opacity-50' : 'scale-100 opacity-20'
          }`}
        />

        {/* Tactile Neumorphic Avatar Core */}
        <div className="w-32 h-32 rounded-full neu-well flex items-center justify-center relative z-10 shadow-inner group">
          <div className="w-24 h-24 rounded-full bg-[#6C63FF] text-white flex items-center justify-center shadow-neu-extruded transition-transform group-hover:scale-105">
            <Bot className="w-12 h-12 stroke-[1.5]" />
          </div>

          {/* Dynamic Audio Waves Bar Visualizer overlay */}
          {(state === 'SPEAKING' || state === 'LISTENING') && (
            <div className="absolute bottom-2 flex items-center gap-1 bg-[#E0E5EC]/90 px-3 py-1 rounded-full neu-well-sm border border-gray-300/40">
              {[40, 70, 100, 60, 85].map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${(h * (speechVolume || 50)) / 100}px`,
                    maxHeight: '16px',
                  }}
                  className="w-1 rounded-full bg-[#6C63FF] animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* State Status Pill */}
      <div
        className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-2 shadow-sm ${statusInfo.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{statusInfo.label}</span>
      </div>
    </div>
  );
}
