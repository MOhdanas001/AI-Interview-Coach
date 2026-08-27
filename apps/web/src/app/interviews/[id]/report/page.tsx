'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Sparkles,
  BarChart3,
  Cpu,
  MessageSquare,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { EvaluationReportDto, InterviewDto } from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function EvaluationReportPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading } = useAuth();

  const [report, setReport] = useState<EvaluationReportDto | null>(null);
  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (accessToken && params.id) {
      fetchReportData(params.id as string);
    }
  }, [accessToken, params.id]);

  const fetchReportData = async (id: string) => {
    setLoadingReport(true);
    try {
      const resSession = await fetch(`${API_BASE_URL}/interviews/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const bodySession = await resSession.json();
      if (resSession.ok && bodySession.success) {
        setInterview(bodySession.data);
      }

      const resReport = await fetch(`${API_BASE_URL}/interviews/${id}/report`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const bodyReport = await resReport.json();
      if (resReport.ok && bodyReport.success) {
        setReport(bodyReport.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingReport(false);
    }
  };

  if (loadingReport) {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#E0E5EC]">
        <div className="p-8 rounded-[32px] neu-well text-[#6C63FF] font-bold animate-pulse text-sm">
          Generating Intelligent Evaluation Report...
        </div>
      </main>
    );
  }

  if (!report || !interview) {
    return (
      <main className="min-h-[calc(100vh-5rem)] p-8 bg-[#E0E5EC] flex justify-center items-center">
        <div className="p-8 rounded-[32px] neu-card text-center flex flex-col items-center gap-4 max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
          <h2 className="text-lg font-bold text-[#3D4852]">Evaluation Report Pending</h2>
          <Link
            href="/interviews"
            className="neu-button-primary px-6 py-3 rounded-2xl text-xs font-bold"
          >
            Back to Interviews
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-10 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/interviews"
            className="neu-well px-4 py-2 rounded-xl text-xs font-bold text-[#3D4852] hover:text-[#6C63FF] flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Sessions</span>
          </Link>

          <Link
            href="/analytics"
            className="text-xs font-extrabold text-[#6C63FF] hover:underline flex items-center gap-1"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hero Score Banner */}
        <div className="p-8 sm:p-10 rounded-[36px] neu-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full neu-well flex flex-col items-center justify-center text-[#6C63FF] relative shadow-inner">
              <span className="text-3xl font-extrabold font-display leading-none">
                {report.overallScore}
              </span>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mt-1">
                OVERALL
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
                Performance Evaluation Report
              </h1>
              <p className="text-xs font-medium text-[#6B7280] mt-1">
                {interview.title} • {interview.targetRole}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 rounded-full neu-well-sm text-[10px] font-extrabold text-[#6C63FF] uppercase tracking-wider">
                  GRADE: A (EXCELLENT)
                </span>
                <span className="text-xs text-[#6B7280] font-medium">
                  Evaluated on {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Score Breakdown Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[28px] neu-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Technical Correctness
              </span>
              <Cpu className="w-4 h-4 text-[#6C63FF]" />
            </div>
            <p className="text-3xl font-extrabold text-[#3D4852] font-display">
              {report.technicalScore} / 100
            </p>
            <div className="w-full h-2 rounded-full neu-well overflow-hidden">
              <div
                style={{ width: `${report.technicalScore}%` }}
                className="h-full bg-[#6C63FF] rounded-full"
              />
            </div>
          </div>

          <div className="p-6 rounded-[28px] neu-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Communication Clarity
              </span>
              <MessageSquare className="w-4 h-4 text-[#38B2AC]" />
            </div>
            <p className="text-3xl font-extrabold text-[#3D4852] font-display">
              {report.communicationScore} / 100
            </p>
            <div className="w-full h-2 rounded-full neu-well overflow-hidden">
              <div
                style={{ width: `${report.communicationScore}%` }}
                className="h-full bg-[#38B2AC] rounded-full"
              />
            </div>
          </div>

          <div className="p-6 rounded-[28px] neu-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Confidence & Reasoning
              </span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-[#3D4852] font-display">
              {report.confidenceScore} / 100
            </p>
            <div className="w-full h-2 rounded-full neu-well overflow-hidden">
              <div
                style={{ width: `${report.confidenceScore}%` }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Strengths & Improvements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Strengths */}
          <div className="p-8 rounded-[32px] neu-card flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display flex items-center gap-2 border-b border-gray-300/40 pb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Key Strengths & Highlights
            </h2>
            <div className="flex flex-col gap-3">
              {report.strengths.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl neu-well flex items-start gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <p className="font-semibold text-[#3D4852] leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="p-8 rounded-[32px] neu-card flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display flex items-center gap-2 border-b border-gray-300/40 pb-4">
              <TrendingUp className="w-5 h-5 text-[#6C63FF]" />
              Targeted Weak Area Drills
            </h2>
            <div className="flex flex-col gap-3">
              {report.improvements.map((imp, idx) => (
                <div key={idx} className="p-4 rounded-2xl neu-well flex items-start gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#6C63FF] mt-1.5 flex-shrink-0" />
                  <p className="font-semibold text-[#3D4852] leading-relaxed">{imp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
