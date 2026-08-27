import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SeniorityLevel } from '@ai-interview-coach/types';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  targetRole?: string;

  @IsString()
  @IsOptional()
  targetCompany?: string;

  @IsEnum(SeniorityLevel, { message: 'Invalid seniority level' })
  @IsOptional()
  seniorityLevel?: SeniorityLevel;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  techStack?: string[];

  @IsString()
  @IsOptional()
  bio?: string;

  @IsInt()
  @Min(0, { message: 'Years of experience must be 0 or greater' })
  @IsOptional()
  yearsOfExperience?: number;
}
