import { Injectable } from '@nestjs/common';
import { HealthResponse } from '@ai-interview-coach/types';

@Injectable()
export class HealthService {
  getHealthStatus(): HealthResponse {
    return {
      status: 'ok',
      service: 'ai-interview-coach-api',
      timestamp: new Date().toISOString(),
    };
  }
}
