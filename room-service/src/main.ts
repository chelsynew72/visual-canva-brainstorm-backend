import { NestFactory } from '@nestjs/core';
import { RoomModule } from './room.module';

async function bootstrap() {
  const app = await NestFactory.create(RoomModule);
  await app.listen(3004); // or your chosen port
}
bootstrap();
