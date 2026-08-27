'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-[#E0E5EC]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] neu-card flex flex-col gap-8 transition-all">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-3xl neu-well flex items-center justify-center text-[#6C63FF] shadow-inner">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
              Welcome Back
            </h1>
            <p className="text-xs font-medium text-[#6B7280] mt-1">
              Sign in to resume your AI interview coaching
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl neu-well border-l-4 border-red-500 flex items-center gap-3 text-xs font-bold text-red-600">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-4 text-[#6B7280]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-4 text-[#6B7280]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40 transition-all"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="neu-button-primary w-full py-4 rounded-2xl text-sm font-extrabold text-white flex items-center justify-center gap-2 mt-4 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs font-semibold text-[#6B7280]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#6C63FF] font-extrabold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </main>
  );
}
