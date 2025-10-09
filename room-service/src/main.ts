import { NestFactory } from '@nestjs/core';
import { RoomModule } from './room.module';

async function bootstrap() {
  const app = await NestFactory.create(RoomModule);

  // Enable CORS for development
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3006;
  await app.listen(3006);
  console.log(`Room service running on port ${port}`);
}
bootstrap();