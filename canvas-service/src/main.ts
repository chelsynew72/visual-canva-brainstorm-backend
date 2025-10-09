import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create hybrid application (HTTP + Microservice)
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3005;
  const rabbitmqUrl = configService.get('RABBITMQ_URL') || 'amqp://localhost:5672';
  const corsOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:3000';
  
  // Configure RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'canvas-service',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 10,
    },
  });

  // Global pipes and configuration
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS for WebSocket and HTTP
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Start both HTTP server and microservices
  await app.startAllMicroservices();
  await app.listen(port);
  
  console.log(`🎨 Canvas Service running on:`);
  console.log(`   HTTP: http://localhost:${port}`);
  console.log(`   WebSocket: ws://localhost:${port}`);
  console.log(`   RabbitMQ: ${rabbitmqUrl}`);
  console.log(`   Health: http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Canvas Service:', error);
  process.exit(1);
});
