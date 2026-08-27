'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Bot,
  Briefcase,
  Building2,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Users,
  Layers,
  Code2,
  HelpCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { InterviewDto, InterviewType } from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function InterviewsListPage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading } = useAuth();

  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (accessToken) {
      fetchInterviews();
    }
  }, [accessToken, selectedType]);

  const fetchInterviews = async () => {
    setLoadingSessions(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/interviews`;
      if (selectedType !== 'ALL') {
        url += `?type=${selectedType}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error?.message || 'Failed to load interviews');
      }

      setInterviews(body.data || []);
    } catch (err: any) {
      setError(err.message || 'Error loading interviews');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this interview session?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setInterviews(interviews.filter((i) => i.id !== id));
      }
    } catch {
      alert('Failed to delete interview');
    }
  };

  const filteredInterviews = interviews.filter((i) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      i.title.toLowerCase().includes(query) ||
      i.targetRole.toLowerCase().includes(query) ||
      (i.targetCompany && i.targetCompany.toLowerCase().includes(query))
    );
  });

  const getTypeIcon = (type: InterviewType) => {
    switch (type) {
      case 'TECHNICAL':
        return Cpu;
      case 'SYSTEM_DESIGN':
        return Layers;
      case 'BEHAVIORAL':
        return Users;
      case 'CODING':
        return Code2;
      case 'HR':
        return HelpCircle;
      default:
        return Sparkles;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'IN_PROGRESS':
        return 'bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 animate-pulse';
      case 'READY':
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      default:
        return 'bg-gray-400/10 text-[#6B7280] border border-gray-400/20';
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-10 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Header Summary & Action */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
                Interview Sessions
              </h1>
              <p className="text-xs font-medium text-[#6B7280] mt-1">
                Manage, launch, and review your practice AI interviews
              </p>
            </div>
          </div>

          <Link
            href="/interviews/new"
            className="neu-button-primary px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-neu-extruded"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create New Interview</span>
          </Link>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl neu-well-sm overflow-x-auto w-full md:w-auto">
            {['ALL', 'TECHNICAL', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'HR', 'CODING'].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedType === t
                      ? 'neu-well text-[#6C63FF]'
                      : 'text-[#3D4852] hover:text-[#6C63FF]'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ),
            )}
          </div>

          {/* Search Input Well */}
          <div className="relative flex items-center w-full md:w-72">
            <Search className="w-4 h-4 absolute left-4 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role or title..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl neu-well text-xs font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl neu-well border-l-4 border-red-500 flex items-center gap-3 text-xs font-bold text-red-600">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sessions List Grid */}
        {loadingSessions ? (
          <div className="p-12 rounded-[32px] neu-card text-center text-[#6C63FF] font-bold text-sm animate-pulse">
            Fetching Practice Sessions...
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="p-12 rounded-[32px] neu-card text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-3xl neu-well flex items-center justify-center text-[#6B7280]">
              <Filter className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#3D4852]">
                No Interview Sessions Found
              </h3>
              <p className="text-xs text-[#6B7280] font-medium mt-1">
                You haven&apos;t created any practice sessions under this filter.
              </p>
            </div>
            <Link
              href="/interviews/new"
              className="neu-button-primary px-6 py-3 rounded-2xl text-xs font-bold mt-2"
            >
              Configure First Session
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInterviews.map((session) => {
              const Icon = getTypeIcon(session.type);
              const statusStyle = getStatusBadge(session.status);

              return (
                <div
                  key={session.id}
                  onClick={() => router.push(`/interviews/${session.id}`)}
                  className="p-6 rounded-[28px] neu-card flex flex-col justify-between gap-6 cursor-pointer hover:neu-well-sm transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl neu-well flex items-center justify-center text-[#6C63FF] group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-extrabold text-[#3D4852] uppercase tracking-wider font-mono">
                          {session.type.replace('_', ' ')}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${statusStyle}`}
                      >
                        {session.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#3D4852] group-hover:text-[#6C63FF] transition-colors leading-snug">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280] font-medium mt-1.5">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-[#6C63FF]" />
                          {session.targetRole}
                        </span>
                        {session.targetCompany && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
                            {session.targetCompany}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Parameters & Trigger */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-300/40">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#6C63FF]" />
                        {session.durationMinutes}m
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full neu-well-sm text-[10px] text-[#6C63FF] font-extrabold">
                        {session.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        className="p-2 rounded-xl neu-well hover:text-red-500 text-[#6B7280] transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="neu-well p-2 rounded-xl text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white transition-all">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
