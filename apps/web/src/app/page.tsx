import Link from 'next/link';
import {
  Bot,
  Mic,
  BrainCircuit,
  BarChart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Volume2,
  Activity,
  Cpu,
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
    <div className="bg-[#E0E5EC] text-[#3D4852] min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center space-y-8 pt-6">
        <div className="flex justify-center">
          <HealthBadge />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#3D4852] font-display max-w-4xl mx-auto leading-tight">
          Master Tech Interviews with <br />
          <span className="text-[#6C63FF]">Tactile AI Voice Coaching</span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-xl text-[#6B7280] font-normal leading-relaxed">
          Practice technical, behavioral, system design, and coding interviews with an interactive, avatar-animated AI voice interviewer molded into a calm, physically grounded Soft UI experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <Link
            href="/dashboard"
            className="neu-button-primary px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>Launch Platform</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com/MOhdanas001/AI-Interview-Coach"
            target="_blank"
            rel="noreferrer"
            className="neu-button px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 text-[#3D4852]"
          >
            <Layers className="w-5 h-5 text-[#6C63FF]" />
            <span>View Architecture</span>
          </a>
        </div>

        {/* Hero Interactive Neumorphic Hardware Showcase */}
        <div className="pt-12 max-w-4xl mx-auto">
          <div className="neu-card p-8 sm:p-12 space-y-8 relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-[#3D4852]">AI INTERVIEW DEVICE v1.0</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1.5 rounded-full neu-well-sm text-[#38B2AC] font-bold">
                  ● 24:36 LIVE
                </span>
              </div>
            </div>

            {/* Middle: AI Avatar & Waveform Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Avatar Box */}
              <div className="neu-well-deep p-8 rounded-[28px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full neu-card flex items-center justify-center text-[#6C63FF] shadow-neu-extruded">
                  <Cpu className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#3D4852]">Senior Software Architect AI</h4>
                  <span className="text-xs text-[#6B7280]">Speaking — System Design & Java Concurrency</span>
                </div>
              </div>

              {/* Transcript Preview */}
              <div className="neu-well p-6 rounded-[24px] space-y-3 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-[#6C63FF]">
                  <Volume2 className="w-4 h-4" />
                  <span>LIVE TRANSCRIPT</span>
                </div>
                <p className="text-xs text-[#3D4852] font-medium leading-relaxed">
                  <strong className="text-[#6C63FF]">AI:</strong> "Explain how ConcurrentHashMap achieves high throughput in multithreaded environments compared to Hashtable."
                </p>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  <strong className="text-[#38B2AC]">YOU:</strong> "It uses lock striping with CAS operations and Node synchronization..."
                </p>
              </div>
            </div>

            {/* Microphone Well Control */}
            <div className="flex justify-center pt-2">
              <div className="neu-well-deep p-4 rounded-full flex items-center gap-4">
                <button className="w-16 h-16 rounded-full neu-button-primary flex items-center justify-center shadow-neu-extruded">
                  <Mic className="w-7 h-7 text-white" />
                </button>
                <div className="px-4 py-2 rounded-full neu-well-sm text-xs font-bold text-[#6C63FF] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#38B2AC] animate-bounce" />
                  <span>Listening... Speak naturally</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-[#3D4852] font-display">
            Physical Tactile Architecture
          </h2>
          <p className="text-[#6B7280] text-sm sm:text-base max-w-xl mx-auto">
            Built using Node.js, NestJS, Next.js, Redis, PostgreSQL with pgvector, and OpenAI Realtime API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="neu-card-hover p-8 rounded-[32px] space-y-4">
            <div className="w-14 h-14 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#3D4852] font-display">Real-Time Voice & Avatar</h3>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Low-latency WebSockets & WebRTC streaming audio with 3D Three.js avatar animations and seamless interruption handling.
            </p>
          </div>

          <div className="neu-card-hover p-8 rounded-[32px] space-y-4">
            <div className="w-14 h-14 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF]">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#3D4852] font-display">RAG & Persistent Memory</h3>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Extracts resume skills & job description requirements using vector embeddings and tracks historic weak topics over time.
            </p>
          </div>

          <div className="neu-card-hover p-8 rounded-[32px] space-y-4">
            <div className="w-14 h-14 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF]">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#3D4852] font-display">Intelligent Evaluation</h3>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Evaluates technical depth, communication, problem-solving, and confidence with personalized study recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* 10-Phase Roadmap Cards */}
      <section className="max-w-7xl mx-auto space-y-12 pb-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6C63FF] px-4 py-2 rounded-full neu-well-sm">
            Development Methodology
          </span>
          <h2 className="text-3xl font-extrabold text-[#3D4852] font-display">
            10-Phase Neumorphic Roadmap
          </h2>
          <p className="text-[#6B7280] text-sm sm:text-base max-w-xl mx-auto">
            Phase 1 Foundation is operational with modular NestJS backend, Next.js frontend, Redis, Docker Compose, and shared packages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {phases.map((p) => (
            <div
              key={p.num}
              className={`p-6 rounded-[28px] flex flex-col justify-between transition-all ${
                p.active ? 'neu-card border-2 border-[#6C63FF]/30' : 'neu-well-sm opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#6C63FF]">Phase {p.num}</span>
                  {p.active ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#38B2AC] neu-well-sm px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#6B7280] font-mono">Planned</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-[#3D4852] leading-snug">{p.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
