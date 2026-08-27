import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Argon2Service } from './argon2.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: any;
  let argon2Mock: any;
  let jwtMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      userProfile: {
        create: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prismaMock)),
    };

    argon2Mock = {
      hash: jest.fn().mockResolvedValue('hashed_password'),
      verify: jest.fn().mockResolvedValue(true),
    };

    jwtMock = {
      signAsync: jest.fn().mockResolvedValue('jwt_token_string'),
      verify: jest.fn().mockReturnValue({ sub: 'user-123' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: Argon2Service, useValue: argon2Mock },
        { provide: JwtService, useValue: jwtMock },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      prismaMock.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'user-123',
          email: 'test@example.com',
          fullName: 'Test User',
          passwordHash: 'hashed_password',
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: {
            id: 'profile-123',
            userId: 'user-123',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

      prismaMock.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'Test User',
      });

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password123!',
        fullName: 'Test User',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.user.email).toBe('test@example.com');
      expect(argon2Mock.hash).toHaveBeenCalledWith('Password123!');
    });

    it('should throw ConflictException if user email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-123' });

      await expect(
        service.register({
          email: 'existing@example.com',
          password: 'Password123!',
          fullName: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should authenticate user and return tokens', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'Test User',
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: null,
      });

      argon2Mock.verify.mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBe('jwt_token_string');
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
