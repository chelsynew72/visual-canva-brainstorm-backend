import { NestFactory } from '@nestjs/core';
import { RoomModule } from './room.module';
import { MongooseModule } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.create(RoomModule);
  // Replace with your MongoDB connection string
  // e.g. mongodb://localhost:27017/room-db
  // If using AppModule, move this to AppModule imports
  // await app.connectMicroservice({
  //   strategy: new MongooseModule.forRoot('mongodb://localhost:27017/room-db'),
  // });
  await app.listen(3004);
}
bootstrap();
