import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Interviews Management (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testUser = {
    email: `int_e2e_${Date.now()}@example.com`,
    password: 'Password123!',
    fullName: 'Interview E2E User',
  };

  let accessToken: string;
  let createdInterviewId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Register user & get token
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(testUser);

    accessToken = res.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.question.deleteMany({
        where: { interview: { user: { email: testUser.email } } },
      });
      await prisma.interview.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.refreshToken.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.userProfile.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.user.deleteMany({
        where: { email: testUser.email },
      });
    }
    await app.close();
  });

  it('/api/v1/interviews (POST) - should create new interview session', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/interviews')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        targetRole: 'Staff AI Engineer',
        targetCompany: 'Google',
        type: 'TECHNICAL',
        difficulty: 'HARD',
        durationMinutes: 45,
        customInstructions: 'Focus on distributed systems and RAG indexing',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.targetRole).toBe('Staff AI Engineer');
    expect(response.body.data.status).toBe('IDLE');
    expect(response.body.data.questions).toBeDefined();

    createdInterviewId = response.body.data.id;
  });

  it('/api/v1/interviews (GET) - should list user interview sessions', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/interviews')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe(createdInterviewId);
  });

  it('/api/v1/interviews/:id (GET) - should return single interview details', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/v1/interviews/${createdInterviewId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(createdInterviewId);
  });

  it('/api/v1/interviews/:id/status (PATCH) - should update status transition', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/interviews/${createdInterviewId}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('IN_PROGRESS');
    expect(response.body.data.startedAt).toBeDefined();
  });

  it('/api/v1/interviews/:id (DELETE) - should delete interview session', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/v1/interviews/${createdInterviewId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
