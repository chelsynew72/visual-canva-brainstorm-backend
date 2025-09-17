import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CanvasGatewayController } from './canvas-gateway.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CANVAS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url') || 'amqp://admin:password@localhost:5672'],
            queue: 'canvas-service-queue',
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    CanvasGatewayController,
  ],
})
export class GatewayModule {}
