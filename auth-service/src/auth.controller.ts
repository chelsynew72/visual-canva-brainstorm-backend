/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @MessagePattern('auth.register')
  async rpcRegister(@Payload() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // RPC handler for gateway -> auth-service over RabbitMQ
  @MessagePattern('auth.login')
  async rpcLogin(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req: AuthenticatedRequest) {
    const user = await this.authService.findById(req.user.userId);
    return user;
  }

  @MessagePattern('auth.verify')
  async rpcVerify(@Payload() tokenDto: any) {
    // For now, simply validate token's presence and return decoded payload if valid
    try {
      const payload = this.authService.validateUser(tokenDto);
      return { valid: true, payload };
    } catch (err) {
      return { valid: false };
    }
  }
}
