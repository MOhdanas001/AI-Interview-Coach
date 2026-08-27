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

export enum SeniorityLevel {
  JUNIOR = 'JUNIOR',
  MID_LEVEL = 'MID_LEVEL',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  PRINCIPAL = 'PRINCIPAL',
  EXECUTIVE = 'EXECUTIVE',
}

export type ExperienceLevel = SeniorityLevel;

export type InterviewStatus =
  | 'IDLE'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED';

export type MessageRole = 'SYSTEM' | 'INTERVIEWER' | 'CANDIDATE';

export type DocumentType = 'RESUME' | 'JOB_DESCRIPTION';

export interface UserProfileDto {
  id: string;
  userId: string;
  targetRole?: string;
  targetCompany?: string;
  seniorityLevel?: SeniorityLevel;
  techStack: string[];
  bio?: string;
  yearsOfExperience: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfileDto | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserDto;
  tokens: AuthTokens;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  avatarUrl?: string;
  targetRole?: string;
  targetCompany?: string;
  seniorityLevel?: SeniorityLevel;
  techStack?: string[];
  bio?: string;
  yearsOfExperience?: number;
}

export interface QuestionDto {
  id: string;
  interviewId: string;
  orderIndex: number;
  text: string;
  category?: string;
  expectedAnswer?: string;
  userAnswer?: string;
  feedback?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewDto {
  id: string;
  userId: string;
  title: string;
  type: InterviewType;
  difficulty: InterviewDifficulty;
  status: InterviewStatus;
  targetRole: string;
  targetCompany?: string;
  durationMinutes: number;
  customInstructions?: string;
  score?: number;
  summary?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
  questions?: QuestionDto[];
}

export interface CreateInterviewDto {
  title?: string;
  type: InterviewType;
  difficulty: InterviewDifficulty;
  targetRole: string;
  targetCompany?: string;
  durationMinutes?: number;
  customInstructions?: string;
}

export interface UpdateInterviewStatusDto {
  status: InterviewStatus;
}

export interface InterviewListFilterDto {
  type?: InterviewType;
  difficulty?: InterviewDifficulty;
  status?: InterviewStatus;
  search?: string;
}

export interface MessageDto {
  id: string;
  interviewId: string;
  sender: MessageRole;
  content: string;
  audioUrl?: string;
  createdAt: string;
}

export interface SendMessageDto {
  content: string;
}

export interface CandidateDocumentDto {
  id: string;
  userId: string;
  title: string;
  type: DocumentType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  title: string;
  type: DocumentType;
  content: string;
}

export interface EvaluationReportDto {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  questionFeedbacks: Array<{
    questionText: string;
    userAnswer: string;
    score: number;
    feedback: string;
  }>;
  createdAt: string;
}

export interface AnalyticsOverviewDto {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  totalPracticeMinutes: number;
  radarScores: {
    technical: number;
    systemDesign: number;
    behavioral: number;
    hr: number;
    coding: number;
  };
  recentScores: Array<{
    date: string;
    score: number;
    title: string;
  }>;
}
