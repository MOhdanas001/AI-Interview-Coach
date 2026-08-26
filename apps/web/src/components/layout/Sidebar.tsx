'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  FileText,
  BarChart3,
  User,
  Settings,
  ShieldCheck,
  BrainCircuit,
  Bot,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard Shell', href: '/dashboard', icon: LayoutDashboard, phase: 'Phase 1' },
  { name: 'User Profile (Auth)', href: '/dashboard/profile', icon: User, phase: 'Phase 2' },
  { name: 'Interview Hub', href: '/dashboard/interviews', icon: Video, phase: 'Phase 3' },
  { name: 'AI Text Interviewer', href: '/dashboard/ai-text', icon: Bot, phase: 'Phase 4' },
  { name: 'Voice Room', href: '/dashboard/voice', icon: BrainCircuit, phase: 'Phase 5' },
  { name: 'RAG & Memory', href: '/dashboard/rag', icon: FileText, phase: 'Phase 7' },
  { name: 'Performance Reports', href: '/dashboard/reports', icon: BarChart3, phase: 'Phase 8' },
  { name: 'Settings & Security', href: '/dashboard/settings', icon: Settings, phase: 'Phase 10' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 backdrop-blur-md flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      item.phase === 'Phase 1'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {item.phase}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>System Status: Operational</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Phase 1 Foundation active. Modular TypeScript backend ready.
        </p>
      </div>
    </aside>
  );
}
