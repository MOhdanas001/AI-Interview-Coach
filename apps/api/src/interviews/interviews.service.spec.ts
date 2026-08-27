import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InterviewsService', () => {
  let service: InterviewsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      interview: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<InterviewsService>(InterviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInterview', () => {
    it('should create an interview session with seed questions', async () => {
      prismaMock.interview.create.mockResolvedValue({
        id: 'interview-123',
        userId: 'user-123',
        title: 'HARD TECHNICAL Interview - Senior AI Engineer',
        type: 'TECHNICAL',
        difficulty: 'HARD',
        status: 'IDLE',
        targetRole: 'Senior AI Engineer',
        targetCompany: 'Google',
        durationMinutes: 45,
        score: null,
        summary: null,
        startedAt: null,
        endedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: 'q-1',
            interviewId: 'interview-123',
            orderIndex: 1,
            text: 'Can you explain architecture patterns?',
            category: 'System Architecture',
            score: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      const result = await service.createInterview('user-123', {
        type: 'TECHNICAL',
        difficulty: 'HARD',
        targetRole: 'Senior AI Engineer',
        targetCompany: 'Google',
        durationMinutes: 45,
      });

      expect(result.id).toBe('interview-123');
      expect(result.questions).toHaveLength(1);
      expect(prismaMock.interview.create).toHaveBeenCalled();
    });
  });

  describe('getInterviewById', () => {
    it('should return interview when found', async () => {
      prismaMock.interview.findFirst.mockResolvedValue({
        id: 'interview-123',
        userId: 'user-123',
        title: 'Behavioral Drill',
        type: 'BEHAVIORAL',
        difficulty: 'MEDIUM',
        status: 'READY',
        targetRole: 'Product Manager',
        durationMinutes: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      });

      const result = await service.getInterviewById('user-123', 'interview-123');
      expect(result.id).toBe('interview-123');
      expect(result.type).toBe('BEHAVIORAL');
    });

    it('should throw NotFoundException if interview does not exist', async () => {
      prismaMock.interview.findFirst.mockResolvedValue(null);

      await expect(
        service.getInterviewById('user-123', 'invalid-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should transition status to IN_PROGRESS and set startedAt', async () => {
      prismaMock.interview.findFirst.mockResolvedValue({
        id: 'interview-123',
        userId: 'user-123',
        status: 'READY',
        startedAt: null,
      });

      prismaMock.interview.update.mockResolvedValue({
        id: 'interview-123',
        userId: 'user-123',
        title: 'Technical Drill',
        type: 'TECHNICAL',
        difficulty: 'MEDIUM',
        status: 'IN_PROGRESS',
        targetRole: 'Backend Lead',
        durationMinutes: 30,
        startedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      });

      const result = await service.updateStatus('user-123', 'interview-123', {
        status: 'IN_PROGRESS',
      });

      expect(result.status).toBe('IN_PROGRESS');
      expect(result.startedAt).toBeDefined();
    });
  });
});
