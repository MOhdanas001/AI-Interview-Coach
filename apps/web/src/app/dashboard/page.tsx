import { HealthBadge } from '@/components/ui/HealthBadge';
import {
  Video,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/60 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">Platform Dashboard Shell</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Phase 1 Active
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Welcome to the AI Interview Coach foundation dashboard. Full-stack monorepo is configured and live.
          </p>
        </div>
        <div>
          <HealthBadge />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Practice Sessions</span>
            <Video className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <span className="text-[11px] text-slate-500">Unlocks in Phase 3</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Average Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">-- / 100</p>
          <span className="text-[11px] text-slate-500">Unlocks in Phase 8</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Practice Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">0 mins</p>
          <span className="text-[11px] text-slate-500">Unlocks in Phase 3</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">System Status</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-emerald-400">100% Operational</p>
          <span className="text-[11px] text-slate-500">NestJS v1 / Health OK</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monorepo Architecture Overview */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            Monorepo Architecture Status
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The project architecture is organized as an enterprise workspace with clean separation between frontend Next.js applications, backend NestJS microservices, and shared TypeScript packages.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-xs font-mono text-sky-400 block mb-1">apps/web</span>
              <p className="text-xs text-slate-300 font-medium">Next.js App Router</p>
              <p className="text-[11px] text-slate-500 mt-1">Tailwind CSS, Lucide Icons, Client API integrations</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-xs font-mono text-indigo-400 block mb-1">apps/api</span>
              <p className="text-xs text-slate-300 font-medium">NestJS Modular API</p>
              <p className="text-[11px] text-slate-500 mt-1">Versioned URI (/api/v1), Global Exception Filters</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-xs font-mono text-purple-400 block mb-1">packages/ai</span>
              <p className="text-xs text-slate-300 font-medium">AI Provider Abstraction</p>
              <p className="text-[11px] text-slate-500 mt-1">MockAIProvider & OpenAI / Pipecat extensibility interfaces</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-xs font-mono text-emerald-400 block mb-1">packages/types & shared</span>
              <p className="text-xs text-slate-300 font-medium">Shared Contracts</p>
              <p className="text-[11px] text-slate-500 mt-1">Global DTOs, Enums, ApiResponse, Error helpers</p>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Next Step Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Phase 1 Complete</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Foundation, API versioning, health check, monorepo configuration, Docker setup, and documentation are ready.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <p className="text-[11px] text-slate-500 uppercase font-mono tracking-wider mb-2">Next Phase</p>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span>Phase 2: Auth & Profiles</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
