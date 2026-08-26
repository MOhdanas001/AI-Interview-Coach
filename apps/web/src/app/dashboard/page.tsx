import { HealthBadge } from '@/components/ui/HealthBadge';
import {
  Video,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Brain,
  Target,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto bg-[#E0E5EC] text-[#3D4852] p-2">
      {/* Header Banner Card */}
      <div className="p-8 sm:p-10 rounded-[32px] neu-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3D4852] font-display">
              Platform Dashboard Shell
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full neu-well-sm text-[#38B2AC] uppercase tracking-wider">
              Phase 1 Active
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Welcome to the AI Interview Coach neumorphic dashboard shell. Full-stack monorepo is fully configured and operational.
          </p>
        </div>
        <div>
          <HealthBadge />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-[28px] neu-card-hover space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Practice Sessions
            </span>
            <div className="w-9 h-9 rounded-xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#3D4852] font-display">0</p>
          <span className="text-[11px] font-semibold text-[#6B7280]">Unlocks in Phase 3</span>
        </div>

        <div className="p-6 rounded-[28px] neu-card-hover space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Average Score
            </span>
            <div className="w-9 h-9 rounded-xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#3D4852] font-display">-- / 100</p>
          <span className="text-[11px] font-semibold text-[#6B7280]">Unlocks in Phase 8</span>
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
          <p className="text-3xl font-extrabold text-[#3D4852] font-display">0 mins</p>
          <span className="text-[11px] font-semibold text-[#6B7280]">Unlocks in Phase 3</span>
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
          <span className="text-[11px] font-semibold text-[#6B7280]">NestJS URI v1 / Health OK</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Monorepo Architecture Overview */}
        <div className="lg:col-span-2 p-8 rounded-[32px] neu-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-[#3D4852] font-display">
              Monorepo Component Layers
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            The system is organized into decoupled workspace packages and modular applications following strict separation of concerns and Tactile Neumorphic design token guidelines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl neu-well space-y-2">
              <span className="text-xs font-mono font-bold text-[#6C63FF] uppercase block">apps/web</span>
              <p className="text-xs text-[#3D4852] font-bold">Next.js 14 App Router</p>
              <p className="text-[11px] text-[#6B7280]">Neumorphic Soft UI design tokens, Lucide icons, HealthBadge</p>
            </div>

            <div className="p-5 rounded-2xl neu-well space-y-2">
              <span className="text-xs font-mono font-bold text-[#38B2AC] uppercase block">apps/api</span>
              <p className="text-xs text-[#3D4852] font-bold">NestJS Modular Backend</p>
              <p className="text-[11px] text-[#6B7280]">Global URI versioning (`/api/v1`), Exception filters, Winston logging</p>
            </div>

            <div className="p-5 rounded-2xl neu-well space-y-2">
              <span className="text-xs font-mono font-bold text-[#6C63FF] uppercase block">packages/ai</span>
              <p className="text-xs text-[#3D4852] font-bold">AI Provider Abstractions</p>
              <p className="text-[11px] text-[#6B7280]">`AIInterviewProvider` and `MockAIProvider` for OpenAI/Pipecat compatibility</p>
            </div>

            <div className="p-5 rounded-2xl neu-well space-y-2">
              <span className="text-xs font-mono font-bold text-[#38B2AC] uppercase block">packages/types & shared</span>
              <p className="text-xs text-[#3D4852] font-bold">Shared Contracts</p>
              <p className="text-[11px] text-[#6B7280]">TypeScript DTO definitions, Enums, ApiResponse, and Error helpers</p>
            </div>
          </div>
        </div>

        {/* Right Col: Phase 1 Status & Next Step Card */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl neu-well flex items-center justify-center text-[#38B2AC]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#3D4852] font-display">
              Phase 1 Completed
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Monorepo setup, NestJS backend API with health endpoint, Next.js Neumorphic frontend layout, Docker Compose, and unit/e2e tests are fully verified.
            </p>
          </div>

          <div className="pt-6 border-t-0 neu-well p-5 rounded-2xl">
            <span className="text-[10px] text-[#6B7280] uppercase font-mono font-bold tracking-wider block mb-2">
              UPCOMING MILESTONE
            </span>
            <div className="flex items-center justify-between text-xs font-bold text-[#3D4852]">
              <span>Phase 2: Auth & Profiles</span>
              <ArrowRight className="w-4 h-4 text-[#6C63FF]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
