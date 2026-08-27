import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, EvaluationReportDto } from '@ai-interview-coach/types';

@Controller('interviews/:id')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post('evaluate')
  async generateReport(
    @Request() req: any,
    @Param('id') interviewId: string,
  ): Promise<ApiResponse<EvaluationReportDto>> {
    const data = await this.evaluationsService.generateReport(
      req.user.id,
      interviewId,
    );
    return { success: true, data };
  }

  @Get('report')
  async getReport(
    @Request() req: any,
    @Param('id') interviewId: string,
  ): Promise<ApiResponse<EvaluationReportDto>> {
    const data = await this.evaluationsService.getReport(
      req.user.id,
      interviewId,
    );
    return { success: true, data };
  }
}
