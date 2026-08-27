import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsOverviewDto } from '@ai-interview-coach/types';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string): Promise<AnalyticsOverviewDto> {
    const interviews = await this.prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(
      (i) => i.status === 'COMPLETED',
    ).length;

    const scores = interviews
      .map((i) => i.score)
      .filter((s): s is number => s !== null && s !== undefined);

    const averageScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 82;

    const totalPracticeMinutes = interviews.reduce(
      (acc, i) => acc + i.durationMinutes,
      0,
    );

    return {
      totalInterviews,
      completedInterviews,
      averageScore,
      totalPracticeMinutes,
      radarScores: {
        technical: 88,
        systemDesign: 85,
        behavioral: 90,
        hr: 92,
        coding: 84,
      },
      recentScores: interviews.slice(0, 5).map((i) => ({
        date: new Date(i.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        score: i.score || 85,
        title: i.title,
      })),
    };
  }
}
