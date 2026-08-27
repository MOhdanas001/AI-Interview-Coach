import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, CandidateDocumentDto, CreateDocumentDto } from '@ai-interview-coach/types';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async createDocument(
    @Request() req: any,
    @Body() dto: CreateDocumentDto,
  ): Promise<ApiResponse<CandidateDocumentDto>> {
    const data = await this.documentsService.createDocument(req.user.id, dto);
    return { success: true, data };
  }

  @Get()
  async getDocuments(
    @Request() req: any,
  ): Promise<ApiResponse<CandidateDocumentDto[]>> {
    const data = await this.documentsService.getDocuments(req.user.id);
    return { success: true, data };
  }

  @Delete(':id')
  async deleteDocument(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const data = await this.documentsService.deleteDocument(req.user.id, id);
    return { success: true, data };
  }
}
