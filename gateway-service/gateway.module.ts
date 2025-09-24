import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from '../src/shared/shared.module';
import { AuthGatewayController } from './auth-gateway.controller';
import { CanvasGatewayController } from './canvas-gateway.controller';
import { UserGatewayController } from './user-gateway.controller';
import { ChatGatewayController } from './chat-gateway.controller';
import { RoomsGatewayController } from './rooms-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || process.env.JWT_SECRET || 'your_default_secret',
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') || '1d' },
      }),
      inject: [ConfigService],
    }),

    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            const rabbitUrl = configService.get<string>('RABBITMQ_URL') || configService.get<string>('rabbitmq.url') || 'amqp://localhost:5672';
            const queue = configService.get<string>('services.auth.queue') || 'auth-service';
            return {
              transport: Transport.RMQ,
              options: {
                urls: [rabbitUrl],
                queue,
                queueOptions: {
                  durable: true,
                },
              },
            };
          },
        inject: [ConfigService],
      },
      {
        name: 'CANVAS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            const rabbitUrl = configService.get<string>('RABBITMQ_URL') || configService.get<string>('rabbitmq.url') || 'amqp://localhost:5672';
            const queue = configService.get<string>('services.canvas.queue') || 'canvas-service';
            return {
              transport: Transport.RMQ,
              options: {
                urls: [rabbitUrl],
                queue,
                queueOptions: {
                  durable: true,
                },
              },
            };
          },
        inject: [ConfigService],
      },
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            const rabbitUrl = configService.get<string>('RABBITMQ_URL') || configService.get<string>('rabbitmq.url') || 'amqp://localhost:5672';
            const queue = configService.get<string>('services.user.queue') || 'user-service';
            return {
              transport: Transport.RMQ,
              options: {
                urls: [rabbitUrl],
                queue,
                queueOptions: {
                  durable: true,
                },
              },
            };
          },
        inject: [ConfigService],
      },
      {
        name: 'CHAT_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            const rabbitUrl = configService.get<string>('RABBITMQ_URL') || configService.get<string>('rabbitmq.url') || 'amqp://localhost:5672';
            const queue = configService.get<string>('services.chat.queue') || 'chat-service';
            return {
              transport: Transport.RMQ,
              options: {
                urls: [rabbitUrl],
                queue,
                queueOptions: {
                  durable: true,
                },
              },
            };
          },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    AuthGatewayController,
    CanvasGatewayController,
    UserGatewayController,
    ChatGatewayController,
    RoomsGatewayController,
  ],
})
export class GatewayModule {}
