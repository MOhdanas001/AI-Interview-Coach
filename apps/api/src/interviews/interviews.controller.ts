import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewStatusDto } from './dto/update-status.dto';
import { InterviewFilterDto } from './dto/interview-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, InterviewDto } from '@ai-interview-coach/types';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  async createInterview(
    @Request() req: any,
    @Body() dto: CreateInterviewDto,
  ): Promise<ApiResponse<InterviewDto>> {
    const data = await this.interviewsService.createInterview(
      req.user.id,
      dto,
    );
    return {
      success: true,
      data,
    };
  }

  @Get()
  async getInterviews(
    @Request() req: any,
    @Query() filter: InterviewFilterDto,
  ): Promise<ApiResponse<InterviewDto[]>> {
    const data = await this.interviewsService.getInterviews(
      req.user.id,
      filter,
    );
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  async getInterviewById(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ApiResponse<InterviewDto>> {
    const data = await this.interviewsService.getInterviewById(
      req.user.id,
      id,
    );
    return {
      success: true,
      data,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateInterviewStatusDto,
  ): Promise<ApiResponse<InterviewDto>> {
    const data = await this.interviewsService.updateStatus(
      req.user.id,
      id,
      dto,
    );
    return {
      success: true,
      data,
    };
  }

  @Delete(':id')
  async deleteInterview(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const data = await this.interviewsService.deleteInterview(
      req.user.id,
      id,
    );
    return {
      success: true,
      data,
    };
  }
}
