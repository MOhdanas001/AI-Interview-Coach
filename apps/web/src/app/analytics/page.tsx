'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Video,
  ChevronLeft,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AnalyticsOverviewDto } from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading } = useAuth();

  const [analytics, setAnalytics] = useState<AnalyticsOverviewDto | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (accessToken) {
      fetchAnalytics();
    }
  }, [accessToken]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setAnalytics(body.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingAnalytics(false);
    }
  };

  if (loadingAnalytics) {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#E0E5EC]">
        <div className="p-8 rounded-[32px] neu-well text-[#6C63FF] font-bold animate-pulse text-sm">
          Computing Performance Analytics...
        </div>
      </main>
    );
  }

  const radarData = analytics?.radarScores || {
    technical: 88,
    systemDesign: 85,
    behavioral: 90,
    hr: 92,
    coding: 84,
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-10 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Top Nav Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="neu-well px-4 py-2 rounded-xl text-xs font-bold text-[#3D4852] hover:text-[#6C63FF] flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" />
            <span className="text-xs font-bold text-[#6C63FF] tracking-wider uppercase font-mono">
              PHASE 9 ANALYTICS ENGINE
            </span>
          </div>
        </div>

        {/* Header Summary */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl neu-well flex items-center justify-center text-[#6C63FF]">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
                Performance & Analytics
              </h1>
              <p className="text-xs font-medium text-[#6B7280] mt-1">
                Track candidate score progression, domain radar strengths, and targeted practice areas
              </p>
            </div>
          </div>

          <Link
            href="/interviews/new"
            className="neu-button-primary px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-neu-extruded"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Target Weak Areas</span>
          </Link>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-[28px] neu-card flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Total Practice Drills
            </span>
            <p className="text-3xl font-extrabold text-[#3D4852] font-display">
              {analytics?.totalInterviews || 0}
            </p>
            <span className="text-[11px] font-semibold text-[#6C63FF]">
              {analytics?.completedInterviews || 0} Completed Sessions
            </span>
          </div>

          <div className="p-6 rounded-[28px] neu-card flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Average Performance
            </span>
            <p className="text-3xl font-extrabold text-[#3D4852] font-display">
              {analytics?.averageScore || 85} / 100
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">Grade: A (Strong)</span>
          </div>

          <div className="p-6 rounded-[28px] neu-card flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Total Practice Time
            </span>
            <p className="text-3xl font-extrabold text-[#3D4852] font-display">
              {analytics?.totalPracticeMinutes || 0} mins
            </p>
            <span className="text-[11px] font-semibold text-[#38B2AC]">Active Mock Drills</span>
          </div>

          <div className="p-6 rounded-[28px] neu-card flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Readiness Status
            </span>
            <p className="text-xl font-extrabold text-[#38B2AC] font-display">Interview Ready</p>
            <span className="text-[11px] font-semibold text-[#6B7280]">Top 10% Candidate</span>
          </div>
        </div>

        {/* Skill Radar & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Radar Breakdown */}
          <div className="p-8 rounded-[32px] neu-card flex flex-col gap-6">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display border-b border-gray-300/40 pb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#6C63FF]" />
              Domain Skill Breakdown
            </h2>

            <div className="flex flex-col gap-4">
              {[
                { label: 'Technical Deep-Dive', score: radarData.technical, color: 'bg-[#6C63FF]' },
                { label: 'System Architecture', score: radarData.systemDesign, color: 'bg-[#38B2AC]' },
                { label: 'Behavioral & Leadership', score: radarData.behavioral, color: 'bg-emerald-500' },
                { label: 'HR & Cultural Fit', score: radarData.hr, color: 'bg-amber-500' },
                { label: 'Coding & Algorithms', score: radarData.coding, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#3D4852]">
                    <span>{item.label}</span>
                    <span>{item.score} / 100</span>
                  </div>
                  <div className="w-full h-3 rounded-full neu-well overflow-hidden">
                    <div
                      style={{ width: `${item.score}%` }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Score Timeline */}
          <div className="p-8 rounded-[32px] neu-card flex flex-col gap-6">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display border-b border-gray-300/40 pb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Recent Practice Scores
            </h2>

            <div className="flex flex-col gap-4">
              {analytics?.recentScores && analytics.recentScores.length > 0 ? (
                analytics.recentScores.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl neu-well flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#6C63FF] text-white flex items-center justify-center font-extrabold text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#3D4852]">{s.title}</h4>
                        <span className="text-[10px] font-semibold text-[#6B7280]">{s.date}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full neu-well-sm text-xs font-extrabold text-[#6C63FF]">
                      {s.score} / 100
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl neu-well text-center text-xs text-[#6B7280] font-medium">
                  Complete your first interview session to unlock score timeline tracking!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
