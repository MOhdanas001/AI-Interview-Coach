import Link from 'next/link';
import {
  Bot,
  Mic,
  BrainCircuit,
  BarChart,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Shield,
  Zap,
} from 'lucide-react';
import { HealthBadge } from '@/components/ui/HealthBadge';

const phases = [
  { num: '01', title: 'Foundation & Architecture', status: 'Completed', active: true },
  { num: '02', title: 'Auth & User Profiles', status: 'Upcoming', active: false },
  { num: '03', title: 'Interview Management', status: 'Upcoming', active: false },
  { num: '04', title: 'AI Text Interviewer', status: 'Upcoming', active: false },
  { num: '05', title: 'Real-Time Voice Streaming', status: 'Upcoming', active: false },
  { num: '06', title: 'Animated AI Avatar', status: 'Upcoming', active: false },
  { num: '07', title: 'RAG & User Memory', status: 'Upcoming', active: false },
  { num: '08', title: 'Intelligent Evaluation', status: 'Upcoming', active: false },
  { num: '09', title: 'Dashboard & Analytics', status: 'Upcoming', active: false },
  { num: '10', title: 'Production Hardening', status: 'Upcoming', active: false },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <HealthBadge />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Master Tech Interviews with <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Real-Time AI Voice Coaching
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-400 font-normal leading-relaxed mb-10">
          Practice technical, behavioral, system design, and coding interviews with an interactive, avatar-animated AI voice interviewer powered by RAG and persistent memory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5 text-sky-200" />
            Explore Dashboard Shell
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-base border border-slate-800 flex items-center justify-center gap-2 transition-all"
          >
            <Layers className="w-5 h-5 text-slate-400" />
            View Monorepo Specs
          </a>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              10-Phase Full-Stack Architecture
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Built using Node.js, NestJS, Next.js, Redis, PostgreSQL with pgvector, and OpenAI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-Time Voice & Avatar</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Low-latency WebSockets & WebRTC streaming audio with animated Three.js avatars and interruption detection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">RAG & Persistent Memory</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Matches questions to candidate resume & target job description using vector embeddings and historic weak topics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Intelligent Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Evaluates correctness, communication, confidence, and technical depth with personalized study recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Phase Development Roadmap Visual */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
            Engineering Methodology
          </span>
          <h2 className="text-3xl font-bold text-white mt-4 mb-3">
            Systematic 10-Phase Roadmap
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Phase 1 Foundation is fully operational with NestJS backend, Next.js frontend, Redis, Docker Compose, and shared workspace packages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {phases.map((p) => (
            <div
              key={p.num}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                p.active
                  ? 'bg-slate-900 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-950/60 border-slate-800/70 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-sky-400">Phase {p.num}</span>
                  {p.active ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Planned</span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white">{p.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
