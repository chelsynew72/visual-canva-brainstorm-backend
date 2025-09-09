import { Module } from '@nestjs/common';
import { ShapesService } from '../shapes/shapes.service';
import { ShapesController } from '../shapes/shapes.controller';

@Module({
  controllers: [ShapesController],
  providers: [ShapesService],
  exports: [ShapesService],
})
export class ShapesModule {}
