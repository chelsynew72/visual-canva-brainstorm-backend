import { Controller, Post, Get, Body, Param, Inject, UseGuards, Options, Req, Res, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../src/shared/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  private readonly logger = new Logger(AuthGatewayController.name);

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: any) {
    return this.authService.send('auth.register', registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: any) {
    this.logger.log(`Incoming login request: ${JSON.stringify({ email: loginDto?.email })}`);
    try {
      const response$ = this.authService.send('auth.login', loginDto);
      const result = await firstValueFrom(response$);
      this.logger.log(`Auth service response: ${typeof result === 'object' ? JSON.stringify(result).slice(0,500) : String(result)}`);
      return result;
    } catch (err) {
      this.logger.error('Auth RPC error', err as any);
      throw err;
    }
  }

  // Explicit preflight handler to ensure CORS headers are returned for login
  @Options('login')
  optionsLogin(@Req() req: any, @Res() res: any) {
    const origin = req.headers.origin || 'http://localhost:3000';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).send();
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() refreshDto: any) {
    return this.authService.send('auth.refresh', refreshDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Body() logoutDto: any) {
    return this.authService.send('auth.logout', logoutDto);
  }

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Param('id') id: string) {
    return this.authService.send('auth.profile', { id });
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Verify JWT token' })
  async verifyToken(@Body() tokenDto: any) {
    return this.authService.send('auth.verify', tokenDto);
  }
}
