import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Argon2Service } from './argon2.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponse, AuthTokens, UserDto } from '@ai-interview-coach/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private argon2Service: Argon2Service,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.argon2Service.hash(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          fullName: dto.fullName,
        },
      });

      await tx.userProfile.create({
        data: {
          userId: newUser.id,
          yearsOfExperience: 0,
          techStack: [],
        },
      });

      return tx.user.findUnique({
        where: { id: newUser.id },
        include: { profile: true },
      });
    });

    if (!user) {
      throw new BadRequestException('Failed to create user account');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.fullName);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.mapUserToDto(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.argon2Service.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.fullName);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.mapUserToDto(user),
      tokens,
    };
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'super-secret-refresh-key-change-in-production';

      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      // Check stored refresh token hash
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: {
          userId: user.id,
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
      });

      let validTokenRecord = null;
      for (const tokenRecord of storedTokens) {
        const isMatch = await this.argon2Service.verify(
          tokenRecord.tokenHash,
          dto.refreshToken,
        );
        if (isMatch) {
          validTokenRecord = tokenRecord;
          break;
        }
      }

      if (!validTokenRecord) {
        throw new UnauthorizedException('Refresh token is invalid or revoked');
      }

      // Revoke old refresh token
      await this.prisma.refreshToken.update({
        where: { id: validTokenRecord.id },
        data: { isRevoked: true },
      });

      // Issue new token pair
      const newTokens = await this.generateTokens(
        user.id,
        user.email,
        user.fullName,
      );
      await this.storeRefreshToken(user.id, newTokens.refreshToken);

      return newTokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: { userId, isRevoked: false },
      });

      for (const tokenRecord of storedTokens) {
        const isMatch = await this.argon2Service.verify(
          tokenRecord.tokenHash,
          refreshToken,
        );
        if (isMatch) {
          await this.prisma.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { isRevoked: true },
          });
          break;
        }
      }
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    }
  }

  private async generateTokens(
    userId: string,
    email: string,
    fullName: string,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email, fullName };

    const accessSecret =
      this.configService.get<string>('JWT_SECRET') ||
      'super-secret-jwt-key-change-in-production';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'super-secret-refresh-key-change-in-production';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const tokenHash = await this.argon2Service.hash(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  private mapUserToDto(user: any): UserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profile: user.profile
        ? {
            id: user.profile.id,
            userId: user.profile.userId,
            targetRole: user.profile.targetRole || undefined,
            targetCompany: user.profile.targetCompany || undefined,
            seniorityLevel: user.profile.seniorityLevel || undefined,
            techStack: user.profile.techStack || [],
            bio: user.profile.bio || undefined,
            yearsOfExperience: user.profile.yearsOfExperience || 0,
            createdAt: user.profile.createdAt.toISOString(),
            updatedAt: user.profile.updatedAt.toISOString(),
          }
        : null,
    };
  }
}
