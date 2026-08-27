export interface AIInterviewContext {
  role: string;
  experienceLevel: string;
  difficulty: string;
  type: string;
  customInstructions?: string;
  resumeContext?: string;
  previousQA?: Array<{ question: string; answer: string; feedback?: string }>;
}

export interface AIResponse {
  content: string;
  feedback?: string;
  score?: number;
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

export class MockAIProvider implements AIInterviewProvider {
  name = 'MockAIProvider';

  async generateNextQuestion(context: AIInterviewContext): Promise<AIResponse> {
    const qCount = (context.previousQA?.length ?? 0) + 1;
    const promptsByDomain: Record<string, string[]> = {
      TECHNICAL: [
        `Can you walk me through the architecture of a high-throughput backend service you designed for a ${context.role}?`,
        `How do you manage memory leaks, database connection pools, and thread pool starvation under heavy load?`,
        `What strategies do you employ for API idempotency, rate limiting, and graceful degradation?`,
      ],
      SYSTEM_DESIGN: [
        `How would you design a globally distributed real-time voice streaming system with low latency?`,
        `Describe how you partition databases, set up multi-region read replicas, and maintain cache consistency.`,
        `What trade-offs do you consider between strong consistency and eventual consistency (CAP Theorem)?`,
      ],
      BEHAVIORAL: [
        `Tell me about a time you had a fundamental architectural disagreement with a principal lead. How did you handle it?`,
        `Describe a scenario where a critical outage occurred in production. How did you triage and perform post-mortem?`,
        `Give an example of how you mentored junior engineers and fostered engineering quality standards.`,
      ],
      HR: [
        `What specific engineering challenges draw you toward pursuing a ${context.role} position right now?`,
        `How do you balance product delivery velocity with technical debt management?`,
        `Where do you project your career trajectory heading over the next 3 years?`,
      ],
    };

    const domainPrompts = promptsByDomain[context.type] || promptsByDomain['TECHNICAL'];
    const text = domainPrompts[(qCount - 1) % domainPrompts.length];

    return {
      content: text,
      questionNumber: qCount,
      isFollowUp: false,
      topic: context.type,
      suggestedAction: qCount >= 3 ? 'WRAP_UP' : 'CONTINUE',
    };
  }

  async evaluateAnswer(question: string, answer: string, context: AIInterviewContext): Promise<AIResponse> {
    const wordCount = answer.trim().split(/\s+/).length;
    const score = Math.min(95, Math.max(65, 70 + Math.floor(wordCount / 5)));

    let feedback = 'Solid explanation covering core engineering concepts.';
    if (wordCount < 15) {
      feedback = 'Answer was quite brief. Consider elaborating with concrete technical examples and trade-off analysis.';
    } else if (wordCount > 60) {
      feedback = 'Comprehensive response detailing architectural trade-offs, performance implications, and practical experience!';
    }

    const nextPrompts = [
      'Excellent response! Next, how do you handle failover and database connection spikes during traffic surges?',
      'Very clear insights. Let\'s transition to how you monitor system observability using metrics, logs, and distributed tracing.',
      'Great job detailing that implementation. Let\'s discuss how you would structure unit and integration test coverage for this component.',
    ];

    const nextQuestion = nextPrompts[Math.floor(Math.random() * nextPrompts.length)];

    return {
      content: `${feedback}\n\n${nextQuestion}`,
      feedback,
      score,
      questionNumber: (context.previousQA?.length ?? 0) + 1,
      isFollowUp: true,
      suggestedAction: 'CONTINUE',
    };
  }
}
