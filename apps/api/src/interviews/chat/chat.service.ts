import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MockAIProvider } from '@ai-interview-coach/ai';
import { MessageDto } from '@ai-interview-coach/types';

@Injectable()
export class ChatService {
  private aiProvider = new MockAIProvider();

  constructor(private prisma: PrismaService) {}

  async getMessages(userId: string, interviewId: string): Promise<MessageDto[]> {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      throw new NotFoundException('Interview session not found');
    }

    const messages = await this.prisma.message.findMany({
      where: { interviewId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => ({
      id: m.id,
      interviewId: m.interviewId,
      sender: m.sender as any,
      content: m.content,
      audioUrl: m.audioUrl || undefined,
      createdAt: m.createdAt.toISOString(),
    }));
  }

  async sendMessage(
    userId: string,
    interviewId: string,
    content: string,
  ): Promise<{ candidateMessage: MessageDto; aiMessage: MessageDto }> {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: { questions: { orderBy: { orderIndex: 'asc' } } },
    });

    if (!interview) {
      throw new NotFoundException('Interview session not found');
    }

    // Save Candidate Message
    const candidateMsg = await this.prisma.message.create({
      data: {
        interviewId,
        sender: 'CANDIDATE',
        content,
      },
    });

    // Evaluate response with AI Provider
    const aiResponse = await this.aiProvider.evaluateAnswer(
      interview.questions[0]?.text || 'Tell me about your technical experience.',
      content,
      {
        role: interview.targetRole,
        experienceLevel: 'SENIOR',
        difficulty: interview.difficulty,
        type: interview.type,
      },
    );

    // Save AI Interviewer Response
    const aiMsg = await this.prisma.message.create({
      data: {
        interviewId,
        sender: 'INTERVIEWER',
        content: aiResponse.content,
      },
    });

    // Update Question feedback if exists
    if (interview.questions.length > 0) {
      await this.prisma.question.update({
        where: { id: interview.questions[0].id },
        data: {
          userAnswer: content,
          feedback: aiResponse.feedback,
          score: aiResponse.score,
        },
      });
    }

    return {
      candidateMessage: {
        id: candidateMsg.id,
        interviewId: candidateMsg.interviewId,
        sender: 'CANDIDATE',
        content: candidateMsg.content,
        createdAt: candidateMsg.createdAt.toISOString(),
      },
      aiMessage: {
        id: aiMsg.id,
        interviewId: aiMsg.interviewId,
        sender: 'INTERVIEWER',
        content: aiMsg.content,
        createdAt: aiMsg.createdAt.toISOString(),
      },
    };
  }
}
