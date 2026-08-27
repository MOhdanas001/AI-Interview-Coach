import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsOverviewDto, ApiResponse } from '@ai-interview-coach/types';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(
    @Request() req: any,
  ): Promise<ApiResponse<AnalyticsOverviewDto>> {
    const data = await this.analyticsService.getOverview(req.user.id);
    return { success: true, data };
  }
}
