'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bot,
  Mic,
  Volume2,
  Wifi,
  Play,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Clock,
  Briefcase,
  Building2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Pause,
  Award,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { InterviewDto } from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function InterviewLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading } = useAuth();

  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  // Hardware readiness simulation
  const [micStatus, setMicStatus] = useState<'testing' | 'ready'>('testing');
  const [speakerStatus, setSpeakerStatus] = useState<'testing' | 'ready'>('testing');
  const [networkStatus, setNetworkStatus] = useState<'testing' | 'ready'>('testing');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (accessToken && params.id) {
      fetchInterviewDetails(params.id as string);
    }
  }, [accessToken, params.id]);

  useEffect(() => {
    // Simulate hardware checks
    const timer = setTimeout(() => {
      setMicStatus('ready');
      setSpeakerStatus('ready');
      setNetworkStatus('ready');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const fetchInterviewDetails = async (id: string) => {
    setLoadingSession(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error?.message || 'Failed to fetch interview lobby');
      }

      setInterview(body.data);
    } catch (err: any) {
      setError(err.message || 'Error loading session');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleStartSession = async () => {
    if (!interview) return;
    setStarting(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/interviews/${interview.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: 'IN_PROGRESS' }),
        },
      );

      const body = await res.json();
      if (res.ok && body.success) {
        setInterview(body.data);
      }
    } catch {
      alert('Failed to start session');
    } finally {
      setStarting(false);
    }
  };

  if (loadingSession) {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#E0E5EC]">
        <div className="p-8 rounded-[32px] neu-well text-[#6C63FF] font-bold animate-pulse text-sm">
          Initializing Pre-Interview Lobby...
        </div>
      </main>
    );
  }

  if (!interview) {
    return (
      <main className="min-h-[calc(100vh-5rem)] p-8 bg-[#E0E5EC] flex justify-center items-center">
        <div className="p-8 rounded-[32px] neu-card text-center flex flex-col items-center gap-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-lg font-bold text-[#3D4852]">Interview Session Not Found</h2>
          <Link
            href="/interviews"
            className="neu-button-primary px-6 py-3 rounded-2xl text-xs font-bold"
          >
            Return to Interviews List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-10 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/interviews"
            className="neu-well px-4 py-2 rounded-xl text-xs font-bold text-[#3D4852] hover:text-[#6C63FF] flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Interviews</span>
          </Link>

          <span className="px-3.5 py-1.5 rounded-full neu-well-sm text-xs font-extrabold text-[#6C63FF] tracking-wider uppercase">
            STATUS: {interview.status}
          </span>
        </div>

        {/* Main Stage Banner */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Bot className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
                {interview.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#6B7280] font-medium">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#6C63FF]" />
                  {interview.targetRole}
                </span>
                {interview.targetCompany && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
                    {interview.targetCompany}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#6C63FF]" />
                  {interview.durationMinutes} minutes
                </span>
              </div>
            </div>
          </div>

          {interview.status === 'IDLE' || interview.status === 'READY' ? (
            <button
              onClick={handleStartSession}
              disabled={starting}
              className="neu-button-primary px-8 py-4 rounded-2xl text-sm font-extrabold text-white flex items-center gap-3.5 shadow-neu-extruded transition-all"
            >
              <Play className="w-5 h-5 fill-current text-white" />
              <span>{starting ? 'Starting Session...' : 'Begin Interview Session'}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl neu-well flex items-center gap-3 text-xs font-bold text-[#6C63FF]">
              <Sparkles className="w-5 h-5 text-[#6C63FF] animate-spin" />
              <span>Session In Progress</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hardware Readiness Checks (2 Columns) */}
          <div className="md:col-span-2 p-8 rounded-[32px] neu-card flex flex-col gap-6">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display flex items-center gap-2 border-b border-gray-300/40 pb-4">
              <ShieldCheck className="w-5 h-5 text-[#6C63FF]" />
              Audio & Hardware Verification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mic Check */}
              <div className="p-5 rounded-2xl neu-well-sm flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl neu-well flex items-center justify-center text-[#6C63FF]">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D4852]">Microphone</h4>
                  <span className="text-[10px] font-extrabold text-emerald-600 flex items-center justify-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {micStatus === 'ready' ? 'Ready' : 'Checking...'}
                  </span>
                </div>
              </div>

              {/* Speaker Check */}
              <div className="p-5 rounded-2xl neu-well-sm flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl neu-well flex items-center justify-center text-[#6C63FF]">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D4852]">Speakers</h4>
                  <span className="text-[10px] font-extrabold text-emerald-600 flex items-center justify-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {speakerStatus === 'ready' ? 'Ready' : 'Checking...'}
                  </span>
                </div>
              </div>

              {/* Network Check */}
              <div className="p-5 rounded-2xl neu-well-sm flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl neu-well flex items-center justify-center text-[#6C63FF]">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D4852]">Voice Gateway</h4>
                  <span className="text-[10px] font-extrabold text-emerald-600 flex items-center justify-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {networkStatus === 'ready' ? 'Low Latency' : 'Checking...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Outline Preview */}
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#3D4852]">
                Seeded Focus Questions ({interview.questions?.length || 0})
              </h3>
              <div className="flex flex-col gap-3">
                {interview.questions?.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl neu-well flex items-start gap-3 text-xs"
                  >
                    <span className="w-6 h-6 rounded-lg bg-[#6C63FF] text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                      {q.orderIndex}
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-[#3D4852]">{q.text}</p>
                      {q.category && (
                        <span className="text-[10px] font-bold text-[#6C63FF]">
                          Category: {q.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Session Overview Sidebar (1 Column) */}
          <div className="p-8 rounded-[32px] neu-card flex flex-col gap-6 h-fit">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display border-b border-gray-300/40 pb-4">
              Session Details
            </h2>

            <div className="flex flex-col gap-4 text-xs font-medium text-[#3D4852]">
              <div className="flex items-center justify-between py-2 border-b border-gray-300/30">
                <span className="text-[#6B7280]">Domain Focus:</span>
                <span className="font-bold text-[#6C63FF]">{interview.type}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-300/30">
                <span className="text-[#6B7280]">Difficulty:</span>
                <span className="font-bold text-[#3D4852]">{interview.difficulty}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-300/30">
                <span className="text-[#6B7280]">Target Duration:</span>
                <span className="font-bold text-[#3D4852]">{interview.durationMinutes} mins</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-300/30">
                <span className="text-[#6B7280]">Created:</span>
                <span className="font-bold text-[#3D4852]">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {interview.customInstructions && (
              <div className="p-4 rounded-2xl neu-well-sm flex flex-col gap-1 text-xs">
                <span className="font-bold text-[#6C63FF] uppercase tracking-wider text-[10px]">
                  Custom Focus Instructions:
                </span>
                <p className="text-[#3D4852] font-medium leading-relaxed italic">
                  &quot;{interview.customInstructions}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
