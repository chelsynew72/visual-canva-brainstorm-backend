import { Controller } from '@nestjs/common';
import { ShapesService } from './shapes.service';

@Controller('shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) {}

  // Shape-related endpoints can be added here if needed
  // Most shape operations will be handled through canvas endpoints
}
