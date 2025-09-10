import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanvasModule } from './canvas/canvas.module';
import { ShapesModule } from './shapes/shapes.module';
// import { CollaborationModule } from './collaboration/collaboration.module';
// import { ExportModule } from './export/export.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
        connectTimeoutMS: configService.get('database.connectionTimeout'),
        maxPoolSize: configService.get('database.maxPoolSize'),
      }),
      inject: [ConfigService],
    }),

    // RabbitMQ clients for inter-service communication
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const userUrl =
            configService.get<string>('services.user.url') ||
            'amqp://localhost:5672';
          const userQueue =
            configService.get<string>('services.user.queue') ||
            'user-service';
          
          return {
            transport: Transport.RMQ,
            options: {
              urls: [userUrl],
              queue: userQueue,
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'ROOM_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const roomUrl =
            configService.get<string>('services.room.url') ||
            'amqp://localhost:5672';
          const roomQueue =
            configService.get<string>('services.room.queue') ||
            'room-service';
          
          return {
            transport: Transport.RMQ,
            options: {
              urls: [roomUrl],
              queue: roomQueue,
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const authUrl =
            configService.get<string>('rabbitmq.url') ||
            'amqp://localhost:5672';
          
          return {
            transport: Transport.RMQ,
            options: {
              urls: [authUrl],
              queue: 'auth-service',
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),

    // Feature modules
    CanvasModule,
    ShapesModule,
    // CollaborationModule,
    // ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
