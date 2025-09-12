import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { CanvasGateway } from './canvas.gateway';
import { Canvas, CanvasSchema } from './schemas/canvas.schema';
import { CollaborationModule } from '../collaboration/collaboration.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'ROOM_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('services.room.url') as string],
            queue: configService.get<string>('services.room.queue'),
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    CollaborationModule,
  ],
  controllers: [CanvasController],
  providers: [CanvasService, CanvasGateway],
  exports: [CanvasService],
})
export class CanvasModule {}
