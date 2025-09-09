import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Visual Canvas Brainstorm API Gateway is running!';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        'auth-service': 'connected',
        'canvas-service': 'connected',
        'user-service': 'connected',
        'chat-service': 'connected',
        'shapes-service': 'connected',
      },
    };
  }
}
