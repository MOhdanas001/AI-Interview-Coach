import Link from 'next/link';
import { Bot, Sparkles, LayoutDashboard } from 'lucide-react';
import { HealthBadge } from '../ui/HealthBadge';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#E0E5EC] border-b-0 shadow-neu-extruded-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-2xl neu-well flex items-center justify-center text-[#6C63FF] group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#3D4852] font-display">
              AI Interview Coach
            </span>
            <span className="text-[10px] text-[#6C63FF] font-bold tracking-widest uppercase">
              TACTILE VOICE PLATFORM
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <HealthBadge />
          
          <nav className="flex items-center gap-2 p-1.5 rounded-2xl neu-well-sm">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#3D4852] hover:text-[#6C63FF] transition-all"
            >
              Overview
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#6C63FF] neu-well flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-[#6C63FF]" />
              Dashboard Shell
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="neu-button-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Launch Platform</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
