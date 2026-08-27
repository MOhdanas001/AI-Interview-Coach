'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Briefcase,
  Building2,
  Award,
  Code2,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SeniorityLevel } from '@ai-interview-coach/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [seniorityLevel, setSeniorityLevel] = useState<SeniorityLevel>(SeniorityLevel.MID_LEVEL);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [bio, setBio] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTargetRole(user.profile?.targetRole || '');
      setTargetCompany(user.profile?.targetCompany || '');
      setSeniorityLevel(
        (user.profile?.seniorityLevel as SeniorityLevel) || SeniorityLevel.MID_LEVEL,
      );
      setYearsOfExperience(user.profile?.yearsOfExperience || 0);
      setTechStack(user.profile?.techStack || []);
      setBio(user.profile?.bio || '');
    }
  }, [user]);

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setError(null);

    try {
      await updateProfile({
        fullName,
        targetRole,
        targetCompany,
        seniorityLevel,
        yearsOfExperience,
        techStack,
        bio,
      });

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#E0E5EC]">
        <div className="p-8 rounded-[32px] neu-well text-[#6C63FF] font-bold animate-pulse text-sm">
          Loading User Session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-10 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Header Profile Summary */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-[#6C63FF] text-white text-3xl font-extrabold flex items-center justify-center shadow-inner">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
                {user.fullName}
              </h1>
              <p className="text-sm font-semibold text-[#6B7280]">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full neu-well-sm text-[10px] font-extrabold text-[#6C63FF] tracking-wider uppercase">
                  {user.profile?.targetRole || 'Candidate'}
                </span>
                <span className="text-xs text-[#6B7280] font-medium">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Banners */}
        {successMessage && (
          <div className="p-4 rounded-2xl neu-well border-l-4 border-emerald-500 flex items-center gap-3 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl neu-well border-l-4 border-red-500 flex items-center gap-3 text-xs font-bold text-red-600">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Editor Form */}
        <form onSubmit={handleSave} className="p-8 rounded-[32px] neu-card flex flex-col gap-8">
          <h2 className="text-lg font-bold text-[#3D4852] font-display flex items-center gap-2 border-b border-gray-300/40 pb-4">
            <User className="w-5 h-5 text-[#6C63FF]" />
            Career & Interview Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-4 text-[#6B7280]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl neu-well text-sm font-medium text-[#3D4852] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
                />
              </div>
            </div>

            {/* Target Role */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Target Role
              </label>
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 absolute left-4 text-[#6B7280]" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
                />
              </div>
            </div>

            {/* Target Company */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Target Company
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 absolute left-4 text-[#6B7280]" />
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google / Meta / Stripe"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
                />
              </div>
            </div>

            {/* Seniority Level */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Seniority Level
              </label>
              <div className="relative flex items-center">
                <Award className="w-4 h-4 absolute left-4 text-[#6B7280]" />
                <select
                  value={seniorityLevel}
                  onChange={(e) => setSeniorityLevel(e.target.value as SeniorityLevel)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl neu-well text-sm font-medium text-[#3D4852] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
                >
                  <option value="JUNIOR">Junior (0-2 YOE)</option>
                  <option value="MID_LEVEL">Mid-Level (2-5 YOE)</option>
                  <option value="SENIOR">Senior (5-8 YOE)</option>
                  <option value="LEAD">Lead / Staff (8+ YOE)</option>
                  <option value="PRINCIPAL">Principal Engineer</option>
                  <option value="EXECUTIVE">Executive / Director</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#6C63FF]" />
              Core Tech Stack & Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Add skill (e.g. React, Node.js, System Design)"
                className="flex-1 px-4 py-3 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-5 py-3 rounded-2xl neu-well text-xs font-bold text-[#6C63FF] hover:bg-[#D4D9E2] flex items-center gap-1 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full neu-well-sm text-xs font-bold text-[#3D4852] flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {techStack.length === 0 && (
                <span className="text-xs text-[#6B7280] italic">
                  No skills added yet. Add your primary technologies above.
                </span>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6C63FF]" />
              Professional Bio & Experience Summary
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe your career background, key projects, and what interview goals you are targeting..."
              className="w-full p-4 rounded-2xl neu-well text-sm font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
            />
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="neu-button-primary px-8 py-4 rounded-2xl text-sm font-extrabold text-white flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
