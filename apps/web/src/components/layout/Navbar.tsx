'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react';
import { HealthBadge } from '../ui/HealthBadge';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-2xl neu-well hover:neu-well-deep transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-[#6C63FF] text-white font-bold flex items-center justify-center text-sm shadow-inner">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-[#3D4852] max-w-[120px] truncate hidden sm:inline">
                  {user.fullName}
                </span>
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 p-2 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded border-0 z-50 flex flex-col gap-1"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-gray-300/40 mb-1">
                    <p className="text-xs font-bold text-[#3D4852] truncate">{user.fullName}</p>
                    <p className="text-[10px] text-[#6B7280] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#3D4852] hover:bg-[#D4D9E2] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#6C63FF]" />
                    Edit Profile
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#3D4852] hover:bg-[#D4D9E2] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#6C63FF]" />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors w-full text-left mt-1 border-t border-gray-300/40"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-[#3D4852] neu-well hover:text-[#6C63FF] transition-all"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="neu-button-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
