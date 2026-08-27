'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HealthBadge } from '@/components/ui/HealthBadge';
import {
  Video,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Layers,
  ArrowRight,
  Plus,
  Play,
  Briefcase,
  Building2,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { InterviewDto } from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function DashboardPage() {
  const { user, accessToken, isAuthenticated } = useAuth();
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchUserInterviews();
    }
  }, [accessToken]);

  const fetchUserInterviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/interviews`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const body = await res.json();
      if (res.ok && body.success) {
        setInterviews(body.data || []);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const totalSessions = interviews.length;
  const completedSessions = interviews.filter((i) => i.status === 'COMPLETED').length;
  const totalMins = interviews.reduce((acc, i) => acc + i.durationMinutes, 0);

  return (
    <div className="space-y-10 max-w-7xl mx-auto bg-[#E0E5EC] text-[#3D4852] p-4 md:p-8">
      {/* Header Banner Card */}
      <div className="p-8 sm:p-10 rounded-[32px] neu-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3D4852] font-display">
              {isAuthenticated && user ? `Welcome Back, ${user.fullName}` : 'Candidate Dashboard'}
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full neu-well-sm text-[#6C63FF] uppercase tracking-wider">
              Phase 3 Active
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Configure and launch real-time practice interviews customized to your target engineering role.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <HealthBadge />
          <Link
            href="/interviews/new"
            className="neu-button-primary px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-neu-extruded"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Interview</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-[28px] neu-card-hover space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Total Practice Sessions
            </span>
            <div className="w-9 h-9 rounded-xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#3D4852] font-display">
            {loading ? '...' : totalSessions}
          </p>
          <span className="text-[11px] font-semibold text-[#6C63FF]">
            {completedSessions} Completed Sessions
          </span>
        </div>

        <div className="p-6 rounded-[28px] neu-card-hover space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Target Position
            </span>
            <div className="w-9 h-9 rounded-xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-extrabold text-[#3D4852] font-display truncate">
            {user?.profile?.targetRole || 'Not Set'}
          </p>
          <Link href="/profile" className="text-[11px] font-semibold text-[#6C63FF] hover:underline">
            Edit Career Profile
          </Link>
        </div>

        <div className="p-6 rounded-[28px] neu-card-hover space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Practice Time
            </span>
            <div className="w-9 h-9 rounded-xl neu-well flex items-center justify-center text-[#38B2AC]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#3D4852] font-display">
            {totalMins} mins
          </p>
          <span className="text-[11px] font-semibold text-[#38B2AC]">Configured Time</span>
        </div>

        <div className="p-6 rounded-[28px] neu-card-hover space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              System Status
            </span>
            <div className="w-9 h-9 rounded-xl neu-well flex items-center justify-center text-[#38B2AC]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-[#38B2AC] font-display">Operational</p>
          <span className="text-[11px] font-semibold text-[#6B7280]">Phase 3 Engine OK</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Interviews List */}
        <div className="lg:col-span-2 p-8 rounded-[32px] neu-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF]">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-[#3D4852] font-display">
                Recent Practice Sessions
              </h2>
            </div>

            <Link
              href="/interviews"
              className="text-xs font-bold text-[#6C63FF] hover:underline flex items-center gap-1"
            >
              <span>View All ({totalSessions})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {interviews.length === 0 ? (
            <div className="p-8 rounded-2xl neu-well text-center flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#6C63FF]" />
              <p className="text-xs font-bold text-[#3D4852]">No practice sessions created yet</p>
              <Link
                href="/interviews/new"
                className="neu-button-primary px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Configure First Interview
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {interviews.slice(0, 4).map((session) => (
                <Link
                  key={session.id}
                  href={`/interviews/${session.id}`}
                  className="p-4 rounded-2xl neu-well flex items-center justify-between hover:neu-well-deep transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#6C63FF] text-white flex items-center justify-center font-bold text-xs">
                      {session.type.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#3D4852] group-hover:text-[#6C63FF] transition-colors">
                        {session.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-[#6B7280]">
                        {session.targetRole} • {session.durationMinutes}m • {session.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full neu-well-sm text-[9px] font-bold text-[#6C63FF]">
                      {session.status}
                    </span>
                    <Play className="w-4 h-4 text-[#6C63FF]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions & Profile Summary */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF]">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#3D4852] font-display">
              Career Profile Summary
            </h3>
            <div className="p-4 rounded-2xl neu-well-sm space-y-2 text-xs font-medium">
              <p>
                <span className="font-bold text-[#3D4852]">Role:</span>{' '}
                {user?.profile?.targetRole || 'Not configured'}
              </p>
              <p>
                <span className="font-bold text-[#3D4852]">Seniority:</span>{' '}
                {user?.profile?.seniorityLevel || 'MID_LEVEL'}
              </p>
              <p>
                <span className="font-bold text-[#3D4852]">Tech Stack:</span>{' '}
                {user?.profile?.techStack?.join(', ') || 'None listed'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              href="/interviews/new"
              className="neu-button-primary w-full py-3.5 rounded-2xl text-xs font-extrabold text-white flex items-center justify-center gap-2 shadow-neu-extruded"
            >
              <Plus className="w-4 h-4" />
              <span>Launch New Interview</span>
            </Link>

            <Link
              href="/profile"
              className="neu-well w-full py-3 rounded-2xl text-xs font-bold text-[#3D4852] hover:text-[#6C63FF] flex items-center justify-center gap-2 transition-all"
            >
              <span>Update Preferences</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
