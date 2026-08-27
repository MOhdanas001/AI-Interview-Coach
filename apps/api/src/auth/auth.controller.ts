import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiResponse, AuthResponse, AuthTokens } from '@ai-interview-coach/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ApiResponse<AuthResponse>> {
    const data = await this.authService.register(dto);
    return {
      success: true,
      data,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const data = await this.authService.login(dto);
    return {
      success: true,
      data,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<ApiResponse<AuthTokens>> {
    const tokens = await this.authService.refreshTokens(dto);
    return {
      success: true,
      data: tokens,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: any,
    @Body() dto?: RefreshTokenDto,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.authService.logout(req.user.id, dto?.refreshToken);
    return {
      success: true,
      data: { message: 'Successfully logged out' },
    };
  }
}
