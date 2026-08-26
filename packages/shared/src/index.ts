import { ApiResponse } from '@ai-interview-coach/types';

export const APP_NAME = 'AI Interview Coach';
export const API_VERSION = 'v1';

export function createApiResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

export function createApiError(code: string, message: string, details?: unknown): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

export const INTERVIEW_ROLES = [
  'Java Developer',
  'Node.js Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'DevOps Engineer',
  'Frontend Developer',
] as const;
