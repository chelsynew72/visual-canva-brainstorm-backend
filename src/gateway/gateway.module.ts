import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CanvasGatewayController } from './canvas-gateway.controller';
import { AuthGatewayController } from './auth-gateway.controller';
import { UserGatewayController } from './user-gateway.controller';

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
      {
        name: 'AUTH_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 3001,
          },
        }),
      },
      {
        name: 'USER_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 3002,
          },
        }),
      },
    ]),
  ],
  controllers: [
    CanvasGatewayController,
    AuthGatewayController,
    UserGatewayController,
  ],
})
export class GatewayModule {}
