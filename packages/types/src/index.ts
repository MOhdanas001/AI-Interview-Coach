export interface HealthResponse {
  status: string;
  service: string;
  timestamp?: string;
  environment?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

export type InterviewType =
  | 'TECHNICAL'
  | 'HR'
  | 'BEHAVIORAL'
  | 'CODING'
  | 'SYSTEM_DESIGN'
  | 'MIXED';

export type InterviewDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type ExperienceLevel =
  | 'FRESHER'
  | 'ONE_TO_TWO_YEARS'
  | 'THREE_TO_FIVE_YEARS'
  | 'FIVE_PLUS_YEARS';

export type InterviewStatus =
  | 'IDLE'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  experienceLevel?: ExperienceLevel;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
}
