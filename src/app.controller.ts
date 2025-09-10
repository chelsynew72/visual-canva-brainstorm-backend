import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      service: 'canvas-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      features: ['canvas-management', 'real-time-collaboration', 'shape-operations', 'export'],
    };
  }
}
