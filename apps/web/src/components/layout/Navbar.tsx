import Link from 'next/link';
import { Bot, Sparkles, LayoutDashboard } from 'lucide-react';
import { HealthBadge } from '../ui/HealthBadge';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AI Interview Coach
            </span>
            <span className="text-[10px] text-sky-400 font-mono tracking-wider">
              REAL-TIME VOICE PLATFORM
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <HealthBadge />
          
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              Dashboard Shell
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-sky-500/25 transition-all hover:shadow-lg hover:shadow-sky-500/35"
          >
            <Sparkles className="w-4 h-4" />
            Launch Platform
          </Link>
        </div>
      </div>
    </header>
  );
}
