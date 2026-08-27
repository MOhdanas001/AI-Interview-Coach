import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  InterviewDifficulty,
  InterviewType,
} from '@ai-interview-coach/types';

export class CreateInterviewDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(
    [
      'TECHNICAL',
      'HR',
      'BEHAVIORAL',
      'CODING',
      'SYSTEM_DESIGN',
      'MIXED',
    ],
    { message: 'Invalid interview type' },
  )
  @IsNotEmpty({ message: 'Interview type is required' })
  type: InterviewType;

  @IsEnum(['EASY', 'MEDIUM', 'HARD', 'EXPERT'], {
    message: 'Invalid difficulty level',
  })
  @IsNotEmpty({ message: 'Difficulty level is required' })
  difficulty: InterviewDifficulty;

  @IsString()
  @IsNotEmpty({ message: 'Target role is required' })
  targetRole: string;

  @IsString()
  @IsOptional()
  targetCompany?: string;

  @IsInt()
  @Min(15, { message: 'Minimum duration is 15 minutes' })
  @Max(120, { message: 'Maximum duration is 120 minutes' })
  @IsOptional()
  durationMinutes?: number = 30;

  @IsString()
  @IsOptional()
  customInstructions?: string;
}
