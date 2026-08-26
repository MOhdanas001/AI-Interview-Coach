export interface AIInterviewContext {
  role: string;
  experienceLevel: string;
  difficulty: string;
  topics: string[];
  previousQA?: Array<{ question: string; answer: string; feedback?: string }>;
}

export interface AIResponse {
  content: string;
  questionNumber?: number;
  isFollowUp?: boolean;
  topic?: string;
  suggestedAction?: 'CONTINUE' | 'WRAP_UP' | 'SWITCH_TOPIC';
}

export interface AIInterviewProvider {
  name: string;
  generateNextQuestion(context: AIInterviewContext): Promise<AIResponse>;
  evaluateAnswer(question: string, answer: string, context: AIInterviewContext): Promise<AIResponse>;
}

export interface RealtimeAIProvider {
  name: string;
  connectSession(sessionId: string): Promise<boolean>;
  disconnectSession(sessionId: string): Promise<boolean>;
}

export class MockAIProvider implements AIInterviewProvider {
  name = 'MockAIProvider';

  async generateNextQuestion(context: AIInterviewContext): Promise<AIResponse> {
    return {
      content: `[Mock AI Provider]: Tell me about a challenging ${context.role} project you built recently.`,
      questionNumber: (context.previousQA?.length ?? 0) + 1,
      isFollowUp: false,
      topic: context.topics[0] || 'General',
      suggestedAction: 'CONTINUE',
    };
  }

  async evaluateAnswer(question: string, answer: string, context: AIInterviewContext): Promise<AIResponse> {
    return {
      content: `Great explanation regarding your ${context.role} experience! Let's dive deeper into system architecture.`,
      questionNumber: (context.previousQA?.length ?? 0) + 1,
      isFollowUp: true,
      suggestedAction: 'CONTINUE',
    };
  }
}
