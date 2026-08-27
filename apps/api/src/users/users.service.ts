import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDto } from '@ai-interview-coach/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return this.mapUserToDto(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const { fullName, avatarUrl, ...profileFields } = dto;

    const user = await this.prisma.$transaction(async (tx) => {
      if (fullName !== undefined || avatarUrl !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: {
            ...(fullName !== undefined && { fullName }),
            ...(avatarUrl !== undefined && { avatarUrl }),
          },
        });
      }

      if (Object.keys(profileFields).length > 0) {
        await tx.userProfile.upsert({
          where: { userId },
          create: {
            userId,
            ...profileFields,
          },
          update: profileFields,
        });
      }

      return tx.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
    });

    return this.mapUserToDto(user);
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
