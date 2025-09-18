import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get service information' })
  @ApiResponse({ status: 200, description: 'Service information retrieved successfully' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Post('api/canvas/save')
  @ApiOperation({ summary: 'Save canvas data' })
  @ApiResponse({ status: 201, description: 'Canvas saved successfully' })
  saveCanvas(@Body() canvasData: any) {
    return this.appService.saveCanvas(canvasData);
  }
}
