'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ChevronLeft,
  Award,
  Sparkles,
  Bot,
  User,
  Square,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AnimatedAvatar } from '@/components/avatar/AnimatedAvatar';
import { InterviewDto, MessageDto } from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function LiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading } = useAuth();

  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarState, setAvatarState] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [speechVolume, setSpeechVolume] = useState(30);

  // Audio / Mic controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (accessToken && params.id) {
      fetchSessionData(params.id as string);
    }
  }, [accessToken, params.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSessionData = async (id: string) => {
    try {
      const resSession = await fetch(`${API_BASE_URL}/interviews/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const bodySession = await resSession.json();
      if (resSession.ok && bodySession.success) {
        setInterview(bodySession.data);
      }

      const resMsgs = await fetch(`${API_BASE_URL}/interviews/${id}/messages`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const bodyMsgs = await resMsgs.json();
      if (resMsgs.ok && bodyMsgs.success) {
        setMessages(bodyMsgs.data || []);
      }
    } catch {
      // Fallback handling
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || isSubmitting || !interview) return;

    const userText = inputContent.trim();
    setInputContent('');
    setIsSubmitting(true);
    setAvatarState('THINKING');

    // Optimistic UI push
    const optimisticCandidateMsg: MessageDto = {
      id: `temp-${Date.now()}`,
      interviewId: interview.id,
      sender: 'CANDIDATE',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticCandidateMsg]);

    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${interview.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: userText }),
      });

      const body = await res.json();
      if (res.ok && body.success) {
        setMessages((prev) => [
          ...prev.filter((m) => !m.id.startsWith('temp-')),
          body.data.candidateMessage,
          body.data.aiMessage,
        ]);

        setAvatarState('SPEAKING');
        setSpeechVolume(75);
        setTimeout(() => {
          setAvatarState('IDLE');
          setSpeechVolume(30);
        }, 3000);
      }
    } catch {
      alert('Failed to send response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishInterview = async () => {
    if (!interview) return;
    if (!confirm('Are you ready to finish this practice session and view your evaluation report?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${interview.id}/evaluate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const body = await res.json();
      if (res.ok && body.success) {
        router.push(`/interviews/${interview.id}/report`);
      }
    } catch {
      alert('Failed to generate evaluation report');
    }
  };

  if (!interview) {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#E0E5EC]">
        <div className="p-8 rounded-[32px] neu-well text-[#6C63FF] font-bold animate-pulse text-sm">
          Loading Interview Session Room...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] p-4 md:p-8 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Top Session Header */}
        <div className="p-6 rounded-[28px] neu-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/interviews/${interview.id}`}
              className="neu-well p-2.5 rounded-xl text-[#3D4852] hover:text-[#6C63FF] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-extrabold text-[#3D4852] font-display">
                {interview.title}
              </h1>
              <p className="text-xs text-[#6B7280] font-medium">
                {interview.targetRole} • {interview.type} • {interview.difficulty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Mute Controls */}
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3 rounded-2xl transition-all ${
                isMicMuted ? 'neu-well text-red-500' : 'neu-well text-[#6C63FF]'
              }`}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className={`p-3 rounded-2xl transition-all ${
                isAudioMuted ? 'neu-well text-red-500' : 'neu-well text-[#6C63FF]'
              }`}
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleFinishInterview}
              className="neu-button-primary px-5 py-3 rounded-2xl text-xs font-extrabold text-white flex items-center gap-2 shadow-neu-extruded"
            >
              <Square className="w-4 h-4 fill-current text-white" />
              <span>Finish & Evaluate</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Stage Status (1 Column) */}
          <div className="flex flex-col gap-6">
            <AnimatedAvatar state={avatarState} speechVolume={speechVolume} />

            <div className="p-6 rounded-[28px] neu-card flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-[#3D4852] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6C63FF]" />
                Domain Focus Guidelines
              </h3>
              <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                Respond with structured engineering trade-offs, architecture patterns, and practical experience. Your responses are analyzed for technical correctness, clarity, and confidence.
              </p>
            </div>
          </div>

          {/* Right Column: Live Message Transcript & Input (2 Columns) */}
          <div className="lg:col-span-2 p-6 rounded-[32px] neu-card flex flex-col h-[580px] justify-between gap-4">
            {/* Scrollable Messages Stream */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="m-auto text-center p-8 neu-well rounded-2xl text-xs font-bold text-[#6C63FF]">
                  AI Interviewer is initializing... Type your first response below to begin!
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.sender === 'CANDIDATE';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 text-xs ${
                        isUser ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isUser ? 'bg-[#6C63FF] text-white' : 'neu-well text-[#6C63FF]'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div
                        className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
                          isUser
                            ? 'bg-[#6C63FF] text-white font-medium shadow-md'
                            : 'neu-well text-[#3D4852] font-medium'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span
                          className={`text-[9px] block mt-1 font-mono opacity-70 ${
                            isUser ? 'text-white' : 'text-[#6B7280]'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Form Well */}
            <form onSubmit={handleSendMessage} className="flex gap-3 pt-2">
              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Type your response to the interviewer..."
                className="flex-1 px-5 py-3.5 rounded-2xl neu-well text-xs font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
              />
              <button
                type="submit"
                disabled={isSubmitting || !inputContent.trim()}
                className="neu-button-primary px-6 py-3.5 rounded-2xl text-xs font-extrabold text-white flex items-center gap-2 disabled:opacity-50 transition-all shadow-neu-extruded"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
