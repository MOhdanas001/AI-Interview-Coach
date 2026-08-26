'use client';

import { useEffect, useState } from 'react';
import { HealthResponse } from '@ai-interview-coach/types';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export function HealthBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    
    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthResponse) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'API Unreachable');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 text-slate-300 text-xs font-medium border border-slate-700 animate-pulse">
        <Activity className="w-3.5 h-3.5 text-sky-400 animate-spin" />
        Checking API Health...
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 text-amber-300 text-xs font-medium border border-amber-800/50">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        API Offline ({error || 'No response'})
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 text-emerald-300 text-xs font-medium border border-emerald-800/60 shadow-sm">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      <span>
        Backend API: <strong className="font-semibold text-emerald-200">{health.status.toUpperCase()}</strong> ({health.service})
      </span>
    </div>
  );
}
