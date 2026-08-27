import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InterviewsModule } from './interviews/interviews.module';
import { DocumentsModule } from './documents/documents.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { VoiceModule } from './voice/voice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    InterviewsModule,
    DocumentsModule,
    EvaluationsModule,
    AnalyticsModule,
    VoiceModule,
  ],
})
export class AppModule {}
