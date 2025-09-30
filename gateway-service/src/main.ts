import { NestFactory } from '@nestjs/core';
import { GatewayModule } from '../src/gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  await app.listen(3002);
}
bootstrap();