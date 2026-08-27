import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  InterviewDifficulty,
  InterviewStatus,
  InterviewType,
} from '@ai-interview-coach/types';

export class InterviewFilterDto {
  @IsEnum(['TECHNICAL', 'HR', 'BEHAVIORAL', 'CODING', 'SYSTEM_DESIGN', 'MIXED'])
  @IsOptional()
  type?: InterviewType;

  @IsEnum(['EASY', 'MEDIUM', 'HARD', 'EXPERT'])
  @IsOptional()
  difficulty?: InterviewDifficulty;

  @IsEnum(['IDLE', 'READY', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: InterviewStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
