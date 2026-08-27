import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      userProfile: {
        upsert: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prismaMock)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'user@example.com',
        fullName: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          id: 'profile-123',
          userId: 'user-123',
          targetRole: 'Senior Fullstack Engineer',
          yearsOfExperience: 5,
          techStack: ['TypeScript', 'NestJS', 'React'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const result = await service.getProfile('user-123');
      expect(result.id).toBe('user-123');
      expect(result.profile?.targetRole).toBe('Senior Fullstack Engineer');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
