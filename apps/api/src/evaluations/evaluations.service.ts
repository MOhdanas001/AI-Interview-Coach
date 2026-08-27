import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EvaluationReportDto } from '@ai-interview-coach/types';

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) {}

  async generateReport(
    userId: string,
    interviewId: string,
  ): Promise<EvaluationReportDto> {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: { questions: true, messages: true },
    });

    if (!interview) {
      throw new NotFoundException('Interview session not found');
    }

    const candidateMsgs = interview.messages.filter(
      (m) => m.sender === 'CANDIDATE',
    );
    const totalWords = candidateMsgs.reduce(
      (acc, m) => acc + m.content.split(/\s+/).length,
      0,
    );

    const overallScore = Math.min(
      96,
      Math.max(72, 75 + Math.floor(candidateMsgs.length * 4 + totalWords / 20)),
    );
    const technicalScore = Math.min(98, overallScore + 2);
    const communicationScore = Math.min(95, overallScore - 1);
    const confidenceScore = Math.min(94, overallScore + 1);

    const report = await this.prisma.evaluationReport.upsert({
      where: { interviewId },
      create: {
        interviewId,
        overallScore,
        technicalScore,
        communicationScore,
        confidenceScore,
        strengths: [
          'Strong command of system architecture principles and scalability trade-offs.',
          'Articulate explanation of database partitioning, caching, and concurrency control.',
          'Clear structured responses addressing edge cases and fault tolerance.',
        ],
        improvements: [
          'Elaborate further on concrete monitoring metrics (e.g. p99 latency SLAs).',
          'Provide more specific cost optimization figures when scaling cloud infrastructure.',
        ],
        summary: `Candidate demonstrated high technical proficiency for the ${interview.targetRole} role, scoring ${overallScore}/100 overall. Excellent clarity in systems reasoning.`,
        questionFeedbacks: JSON.stringify(
          interview.questions.map((q) => ({
            questionText: q.text,
            userAnswer: q.userAnswer || 'Candidate provided verbal answer.',
            score: q.score || overallScore,
            feedback: q.feedback || 'Strong technical explanation with clear reasoning.',
          })),
        ),
      },
      update: {
        overallScore,
        technicalScore,
        communicationScore,
        confidenceScore,
      },
    });

    // Mark interview status as COMPLETED
    await this.prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'COMPLETED', score: overallScore, endedAt: new Date() },
    });

    return this.mapToDto(report);
  }

  async getReport(
    userId: string,
    interviewId: string,
  ): Promise<EvaluationReportDto> {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      throw new NotFoundException('Interview session not found');
    }

    const report = await this.prisma.evaluationReport.findUnique({
      where: { interviewId },
    });

    if (!report) {
      // Auto-generate if not created yet
      return this.generateReport(userId, interviewId);
    }

    return this.mapToDto(report);
  }

  private mapToDto(report: any): EvaluationReportDto {
    return {
      id: report.id,
      interviewId: report.interviewId,
      overallScore: report.overallScore,
      technicalScore: report.technicalScore,
      communicationScore: report.communicationScore,
      confidenceScore: report.confidenceScore,
      strengths: report.strengths,
      improvements: report.improvements,
      summary: report.summary,
      questionFeedbacks: JSON.parse(report.questionFeedbacks || '[]'),
      createdAt: report.createdAt.toISOString(),
    };
  }
}
