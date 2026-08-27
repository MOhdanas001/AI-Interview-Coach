'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bot,
  Briefcase,
  Building2,
  Code2,
  Cpu,
  Clock,
  Layers,
  Sparkles,
  Users,
  ShieldAlert,
  ArrowRight,
  ChevronLeft,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  CreateInterviewDto,
  InterviewDifficulty,
  InterviewType,
} from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function NewInterviewPage() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, isLoading } = useAuth();

  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [type, setType] = useState<InterviewType>('TECHNICAL');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('MEDIUM');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.profile) {
      if (user.profile.targetRole) setTargetRole(user.profile.targetRole);
      if (user.profile.targetCompany) setTargetCompany(user.profile.targetCompany);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      setError('Please enter a target role/position');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateInterviewDto = {
        targetRole,
        targetCompany: targetCompany.trim() || undefined,
        type,
        difficulty,
        durationMinutes,
        customInstructions: customInstructions.trim() || undefined,
      };

      const res = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error?.message || 'Failed to create interview session');
      }

      router.push(`/interviews/${body.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize interview session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const interviewTypes: Array<{
    id: InterviewType;
    label: string;
    description: string;
    icon: React.ElementType;
  }> = [
    {
      id: 'TECHNICAL',
      label: 'Technical Deep-Dive',
      description: 'System architecture, frameworks, design patterns, and engineering principles.',
      icon: Cpu,
    },
    {
      id: 'SYSTEM_DESIGN',
      label: 'System Design',
      description: 'High-availability architecture, scalability, data storage, and load balancing.',
      icon: Layers,
    },
    {
      id: 'BEHAVIORAL',
      label: 'Behavioral & Leadership',
      description: 'STAR methodology questions focusing on conflict resolution, impact, and teamwork.',
      icon: Users,
    },
    {
      id: 'HR',
      label: 'HR & Cultural Fit',
      description: 'Career goals, motivation, salary expectations, and company values alignment.',
      icon: HelpCircle,
    },
    {
      id: 'CODING',
      label: 'Coding & Algorithms',
      description: 'Data structures, algorithmic time complexity, and problem-solving drills.',
      icon: Code2,
    },
    {
      id: 'MIXED',
      label: 'Mixed Full-Loop',
      description: 'Comprehensive evaluation combining technical, behavioral, and architectural topics.',
      icon: Sparkles,
    },
  ];

  const difficulties: Array<{ id: InterviewDifficulty; label: string; badgeColor: string }> = [
    { id: 'EASY', label: 'Easy (Junior)', badgeColor: 'text-emerald-600' },
    { id: 'MEDIUM', label: 'Medium (Mid-Level)', badgeColor: 'text-[#6C63FF]' },
    { id: 'HARD', label: 'Hard (Senior / Lead)', badgeColor: 'text-amber-600' },
    { id: 'EXPERT', label: 'Expert (Staff / Principal)', badgeColor: 'text-rose-600' },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-10 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Top Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/interviews"
            className="neu-well px-4 py-2 rounded-xl text-xs font-bold text-[#3D4852] hover:text-[#6C63FF] flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" />
            <span className="text-xs font-bold text-[#6C63FF] tracking-wider uppercase font-mono">
              PHASE 3 CONFIGURATOR
            </span>
          </div>
        </div>

        {/* Header Title */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Sliders className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
                Create New Interview Session
              </h1>
              <p className="text-xs font-medium text-[#6B7280] mt-1">
                Configure your target position, domain focus, and difficulty level
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl neu-well border-l-4 border-red-500 flex items-center gap-3 text-xs font-bold text-red-600">
            <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="p-8 rounded-[32px] neu-card flex flex-col gap-8">
          {/* Section 1: Role & Company */}
          <div className="flex flex-col gap-4 border-b border-gray-300/40 pb-6">
            <h2 className="text-sm font-extrabold text-[#3D4852] uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#6C63FF]" />
              Target Position & Company
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#3D4852]">
                  Target Role / Job Title *
                </label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 absolute left-4 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#3D4852]">
                  Target Company (Optional)
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 absolute left-4 text-[#6B7280]" />
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Google, Meta, Stripe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Interview Type Selector */}
          <div className="flex flex-col gap-4 border-b border-gray-300/40 pb-6">
            <h2 className="text-sm font-extrabold text-[#3D4852] uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#6C63FF]" />
              Select Interview Domain & Type
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`p-5 rounded-2xl flex flex-col gap-3 text-left transition-all ${
                      isSelected
                        ? 'neu-well border-2 border-[#6C63FF] scale-[1.02]'
                        : 'neu-well-sm hover:neu-well'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#6C63FF] text-white'
                            : 'neu-well text-[#6C63FF]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#3D4852]">
                        {item.label}
                      </h3>
                      <p className="text-[11px] text-[#6B7280] font-medium leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Difficulty & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-300/40 pb-6">
            {/* Difficulty Pills */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => {
                  const isSelected = difficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setDifficulty(diff.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                        isSelected
                          ? 'neu-well text-[#6C63FF] border-2 border-[#6C63FF]'
                          : 'neu-well-sm text-[#3D4852] hover:neu-well'
                      }`}
                    >
                      {diff.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Selector */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6C63FF]" />
                Target Session Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => {
                  const isSelected = durationMinutes === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'neu-well text-[#6C63FF] border-2 border-[#6C63FF]'
                          : 'neu-well-sm text-[#3D4852] hover:neu-well'
                      }`}
                    >
                      {mins} mins
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Custom Instructions */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6C63FF]" />
              Custom Focus Topics & Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Focus heavily on distributed caching, Redis failure scenarios, and Microservices event-driven architecture..."
              className="w-full p-4 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
            />
          </div>

          {/* Submit Trigger */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="neu-button-primary px-8 py-4 rounded-2xl text-sm font-extrabold text-white flex items-center gap-2 disabled:opacity-50 transition-all shadow-neu-extruded"
            >
              {isSubmitting ? (
                <span>Generating Session...</span>
              ) : (
                <>
                  <span>Create Interview & Enter Lobby</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
