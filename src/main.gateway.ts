import { NestFactory } from '@nestjs/core';
import { GatewayAppModule } from './gateway-app.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayAppModule);
  await app.listen(3002); // Gateway port
  console.log('🚀 API Gateway running on: http://localhost:3002');
}

bootstrap();
