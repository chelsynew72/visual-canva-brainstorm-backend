import { NestFactory } from '@nestjs/core';
import { GatewayAppModule } from './gateway-app.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayAppModule);
  // Enable CORS for the frontend origin and allow Authorization header
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(3002); // Gateway port
  console.log('🚀 API Gateway running on: http://localhost:3002');
}

bootstrap();
