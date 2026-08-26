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
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neu-well-sm text-xs font-medium text-[#6B7280]">
        <Activity className="w-3.5 h-3.5 text-[#6C63FF] animate-spin" />
        <span>Checking API Health...</span>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neu-well-sm text-xs font-medium text-amber-700">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        <span>API Offline ({error || 'No response'})</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neu-card-sm text-xs font-semibold text-[#3D4852]">
      <div className="w-2 h-2 rounded-full bg-[#38B2AC] animate-pulse" />
      <CheckCircle2 className="w-3.5 h-3.5 text-[#38B2AC]" />
      <span>
        Backend API: <strong className="text-[#38B2AC] font-bold">{health.status.toUpperCase()}</strong> ({health.service})
      </span>
    </div>
  );
}
