import { Module } from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { ShapesController } from './shapes.controller';

@Module({
  controllers: [ShapesController],
  providers: [ShapesService],
  exports: [ShapesService],
})
export class ShapesModule {}
