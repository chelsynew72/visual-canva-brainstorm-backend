import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGatewayController } from './auth-gateway.controller';
import { CanvasGatewayController } from './canvas-gateway.controller';
import { UserGatewayController } from './user-gateway.controller';
import { ChatGatewayController } from './chat-gateway.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('services.auth.queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CANVAS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('services.canvas.queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('services.user.queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CHAT_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('services.chat.queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    AuthGatewayController,
    CanvasGatewayController,
    UserGatewayController,
    ChatGatewayController,
  ],
})
export class GatewayModule {}
