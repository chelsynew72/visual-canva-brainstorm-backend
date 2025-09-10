import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Canvas Service is running! 🎨';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'canvas-service',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      dependencies: {
        mongodb: 'connected',
        rabbitmq: 'connected',
      },
    };
  }
}
