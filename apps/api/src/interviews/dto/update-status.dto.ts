import { IsEnum, IsNotEmpty } from 'class-validator';
import { InterviewStatus } from '@ai-interview-coach/types';

export class UpdateInterviewStatusDto {
  @IsEnum(
    ['IDLE', 'READY', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    { message: 'Invalid interview status transition' },
  )
  @IsNotEmpty({ message: 'Status is required' })
  status: InterviewStatus;
}
