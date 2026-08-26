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
    <aside className="w-72 bg-[#E0E5EC] p-6 flex flex-col justify-between min-h-[calc(100vh-5rem)]">
      <div className="space-y-6">
        <div className="px-2">
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4 font-display">
            Tactile Menu
          </p>
          <nav className="space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    isActive
                      ? 'neu-well text-[#6C63FF] font-bold'
                      : 'neu-button text-[#3D4852] font-semibold hover:text-[#6C63FF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive ? 'neu-well-sm text-[#6C63FF]' : 'neu-well-sm text-[#6B7280]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      item.phase === 'Phase 1'
                        ? 'neu-well-sm text-[#38B2AC]'
                        : 'text-[#6B7280]'
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

      <div className="p-5 rounded-2xl neu-well space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#38B2AC]">
          <ShieldCheck className="w-4 h-4 text-[#38B2AC]" />
          <span>System Status: Operational</span>
        </div>
        <p className="text-[11px] text-[#6B7280] font-normal leading-relaxed">
          Tactile Neumorphic design tokens loaded. NestJS backend active.
        </p>
      </div>
    </aside>
  );
}
