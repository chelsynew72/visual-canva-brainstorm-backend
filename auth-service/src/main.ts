import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
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

  // Connect to RabbitMQ so this service can handle RPC messages from the gateway
  const rmqUrl =
    process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672';
  const authQueue = process.env.AUTH_SERVICE_QUEUE || 'auth-service';
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: authQueue,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start Auth Service:', error);
  process.exit(1);
});
