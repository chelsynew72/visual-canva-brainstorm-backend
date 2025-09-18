import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  
  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe());
  
  // Enable CORS for development
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start Auth Service:', error);
  process.exit(1);
});
