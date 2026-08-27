import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewStatusDto } from './dto/update-status.dto';
import { InterviewFilterDto } from './dto/interview-filter.dto';
import { InterviewDto, InterviewType } from '@ai-interview-coach/types';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async createInterview(
    userId: string,
    dto: CreateInterviewDto,
  ): Promise<InterviewDto> {
    const title =
      dto.title ||
      `${dto.difficulty} ${dto.type.replace('_', ' ')} Interview - ${
        dto.targetRole
      }`;

    const seedQuestions = this.generateSeedQuestions(dto.type, dto.targetRole);

    const interview = await this.prisma.interview.create({
      data: {
        userId,
        title,
        type: dto.type,
        difficulty: dto.difficulty,
        targetRole: dto.targetRole,
        targetCompany: dto.targetCompany,
        durationMinutes: dto.durationMinutes || 30,
        customInstructions: dto.customInstructions,
        status: 'IDLE',
        questions: {
          create: seedQuestions.map((q, idx) => ({
            orderIndex: idx + 1,
            text: q.text,
            category: q.category,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    return this.mapInterviewToDto(interview);
  }

  async getInterviews(
    userId: string,
    filter: InterviewFilterDto,
  ): Promise<InterviewDto[]> {
    const where: any = { userId };

    if (filter.type) where.type = filter.type;
    if (filter.difficulty) where.difficulty = filter.difficulty;
    if (filter.status) where.status = filter.status;
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { targetRole: { contains: filter.search, mode: 'insensitive' } },
        { targetCompany: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const interviews = await this.prisma.interview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    return interviews.map((i) => this.mapInterviewToDto(i));
  }

  async getInterviewById(
    userId: string,
    interviewId: string,
  ): Promise<InterviewDto> {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview session not found');
    }

    return this.mapInterviewToDto(interview);
  }

  async updateStatus(
    userId: string,
    interviewId: string,
    dto: UpdateInterviewStatusDto,
  ): Promise<InterviewDto> {
    const existing = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Interview session not found');
    }

    const data: any = { status: dto.status };

    if (dto.status === 'IN_PROGRESS' && !existing.startedAt) {
      data.startedAt = new Date();
    } else if (
      (dto.status === 'COMPLETED' || dto.status === 'CANCELLED') &&
      !existing.endedAt
    ) {
      data.endedAt = new Date();
    }

    const updated = await this.prisma.interview.update({
      where: { id: interviewId },
      data,
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    return this.mapInterviewToDto(updated);
  }

  async deleteInterview(
    userId: string,
    interviewId: string,
  ): Promise<{ message: string }> {
    const existing = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Interview session not found');
    }

    await this.prisma.interview.delete({
      where: { id: interviewId },
    });

    return { message: 'Interview session deleted successfully' };
  }

  private generateSeedQuestions(
    type: InterviewType,
    role: string,
  ): Array<{ text: string; category: string }> {
    switch (type) {
      case 'TECHNICAL':
        return [
          {
            text: `Can you explain the key architectural patterns you use when designing scalable backend services for a ${role}?`,
            category: 'System Architecture',
          },
          {
            text: 'How do you handle asynchronous task processing, concurrency, and race conditions in production?',
            category: 'Concurrency & Async',
          },
          {
            text: 'What approaches do you take for API performance optimization, indexing, and caching strategy?',
            category: 'Performance Tuning',
          },
        ];
      case 'HR':
        return [
          {
            text: `What motivates you to pursue a ${role} position at this stage in your career?`,
            category: 'Motivation & Career Goals',
          },
          {
            text: 'Describe a situation where you had to manage competing deadlines under pressure. How did you prioritize?',
            category: 'Time Management',
          },
          {
            text: 'Where do you see yourself professionally over the next 3 to 5 years?',
            category: 'Long-term Vision',
          },
        ];
      case 'BEHAVIORAL':
        return [
          {
            text: 'Tell me about a time you strongly disagreed with a technical decision made by a team member or leader. How did you resolve it?',
            category: 'Conflict Resolution',
          },
          {
            text: 'Describe a project that failed or missed its target. What did you learn, and what would you do differently today?',
            category: 'Adaptability & Growth',
          },
          {
            text: 'Give an example of how you mentored a peer or influenced engineering best practices in your team.',
            category: 'Leadership & Collaboration',
          },
        ];
      case 'CODING':
        return [
          {
            text: 'Walk me through how you optimize data structures and algorithm time complexity (Big-O) for high-throughput algorithms.',
            category: 'Algorithms & Data Structures',
          },
          {
            text: 'How do you structure unit tests and edge-case handling for complex business logic functions?',
            category: 'Testing & Code Quality',
          },
        ];
      case 'SYSTEM_DESIGN':
        return [
          {
            text: `How would you design a distributed, real-time voice and streaming platform for a ${role}?`,
            category: 'High-Level Design',
          },
          {
            text: 'How do you address database sharding, replication, and vector database indexing at scale?',
            category: 'Data Storage & Scaling',
          },
        ];
      default:
        return [
          {
            text: `Tell me about your most technical accomplishment as a ${role}.`,
            category: 'General Overview',
          },
          {
            text: 'How do you handle technical debt while keeping product feature velocity high?',
            category: 'Engineering Culture',
          },
        ];
    }
  }

  private mapInterviewToDto(interview: any): InterviewDto {
    return {
      id: interview.id,
      userId: interview.userId,
      title: interview.title,
      type: interview.type,
      difficulty: interview.difficulty,
      status: interview.status,
      targetRole: interview.targetRole,
      targetCompany: interview.targetCompany || undefined,
      durationMinutes: interview.durationMinutes,
      customInstructions: interview.customInstructions || undefined,
      score: interview.score !== null ? interview.score : undefined,
      summary: interview.summary || undefined,
      startedAt: interview.startedAt
        ? interview.startedAt.toISOString()
        : undefined,
      endedAt: interview.endedAt
        ? interview.endedAt.toISOString()
        : undefined,
      createdAt: interview.createdAt.toISOString(),
      updatedAt: interview.updatedAt.toISOString(),
      questions: interview.questions
        ? interview.questions.map((q: any) => ({
            id: q.id,
            interviewId: q.interviewId,
            orderIndex: q.orderIndex,
            text: q.text,
            category: q.category || undefined,
            expectedAnswer: q.expectedAnswer || undefined,
            userAnswer: q.userAnswer || undefined,
            feedback: q.feedback || undefined,
            score: q.score !== null ? q.score : undefined,
            createdAt: q.createdAt.toISOString(),
            updatedAt: q.updatedAt.toISOString(),
          }))
        : [],
    };
  }
}
