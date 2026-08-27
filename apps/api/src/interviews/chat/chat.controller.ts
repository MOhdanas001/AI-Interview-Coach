import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiResponse, MessageDto, SendMessageDto } from '@ai-interview-coach/types';

@Controller('interviews/:id/messages')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getMessages(
    @Request() req: any,
    @Param('id') interviewId: string,
  ): Promise<ApiResponse<MessageDto[]>> {
    const data = await this.chatService.getMessages(req.user.id, interviewId);
    return { success: true, data };
  }

  @Post()
  async sendMessage(
    @Request() req: any,
    @Param('id') interviewId: string,
    @Body() dto: SendMessageDto,
  ): Promise<
    ApiResponse<{ candidateMessage: MessageDto; aiMessage: MessageDto }>
  > {
    const data = await this.chatService.sendMessage(
      req.user.id,
      interviewId,
      dto.content,
    );
    return { success: true, data };
  }
}
