'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  UploadCloud,
  FileCheck,
  Trash2,
  Plus,
  Sparkles,
  ChevronLeft,
  Briefcase,
  Layers,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CandidateDocumentDto, DocumentType } from '@ai-interview-coach/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function CandidateDocumentsPage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading } = useAuth();

  const [documents, setDocuments] = useState<CandidateDocumentDto[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('RESUME');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (accessToken) {
      fetchDocuments();
    }
  }, [accessToken]);

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch(`${API_BASE_URL}/documents`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setDocuments(body.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, type, content }),
      });

      const body = await res.json();
      if (res.ok && body.success) {
        setDocuments([body.data, ...documents]);
        setTitle('');
        setContent('');
      }
    } catch {
      alert('Failed to upload document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document from RAG memory?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        setDocuments(documents.filter((d) => d.id !== id));
      }
    } catch {
      alert('Failed to delete document');
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] p-6 md:p-10 bg-[#E0E5EC] flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="neu-well px-4 py-2 rounded-xl text-xs font-bold text-[#3D4852] hover:text-[#6C63FF] flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38B2AC] animate-pulse" />
            <span className="text-xs font-bold text-[#38B2AC] tracking-wider uppercase font-mono">
              PHASE 7 RAG MEMORY ACTIVE
            </span>
          </div>
        </div>

        {/* Header Summary */}
        <div className="p-8 rounded-[32px] neu-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl neu-well flex items-center justify-center text-[#6C63FF]">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#3D4852] font-display">
                RAG Candidate Memory Manager
              </h1>
              <p className="text-xs font-medium text-[#6B7280] mt-1">
                Upload Resumes and Job Descriptions for contextual AI interviewer prompt injection
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Upload Form (1 Column) */}
          <form onSubmit={handleUpload} className="p-8 rounded-[32px] neu-card flex flex-col gap-6 h-fit">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display border-b border-gray-300/40 pb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#6C63FF]" />
              Add Document Context
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Document Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Staff Resume 2026"
                className="w-full px-4 py-3 rounded-2xl neu-well text-xs font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Document Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="w-full px-4 py-3 rounded-2xl neu-well text-xs font-medium text-[#3D4852] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
              >
                <option value="RESUME">Candidate Resume (PDF/Text)</option>
                <option value="JOB_DESCRIPTION">Target Job Description</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3D4852]">
                Document Content / Text
              </label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste full resume text or target job description requirements..."
                className="w-full p-4 rounded-2xl neu-well text-xs font-medium text-[#3D4852] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="neu-button-primary w-full py-3.5 rounded-2xl text-xs font-extrabold text-white flex items-center justify-center gap-2 shadow-neu-extruded"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Parsing & Indexing...' : 'Add to Vector Store'}</span>
            </button>
          </form>

          {/* RAG Memory Documents Grid (2 Columns) */}
          <div className="lg:col-span-2 p-8 rounded-[32px] neu-card flex flex-col gap-6">
            <h2 className="text-base font-extrabold text-[#3D4852] font-display border-b border-gray-300/40 pb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#38B2AC]" />
              Indexed Memory Documents ({documents.length})
            </h2>

            {loadingDocs ? (
              <div className="p-8 rounded-2xl neu-well text-center text-[#6C63FF] font-bold text-xs animate-pulse">
                Fetching Vector Memory Store...
              </div>
            ) : documents.length === 0 ? (
              <div className="p-8 rounded-2xl neu-well text-center flex flex-col items-center gap-3">
                <FileText className="w-8 h-8 text-[#6B7280]" />
                <p className="text-xs font-bold text-[#3D4852]">No RAG memory documents added yet</p>
                <p className="text-[11px] text-[#6B7280]">
                  Upload your resume or target JD on the left to personalize AI interview questions!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-2xl neu-well flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#6C63FF] text-white flex items-center justify-center font-bold flex-shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-extrabold text-[#3D4852]">{doc.title}</h4>
                        <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-wider">
                          TYPE: {doc.type} • INDEXED IN PGVECTOR
                        </span>
                        <p className="text-xs text-[#6B7280] font-medium line-clamp-2 mt-1">
                          {doc.content}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-xl neu-well hover:text-red-500 text-[#6B7280] transition-colors"
                      title="Remove Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
