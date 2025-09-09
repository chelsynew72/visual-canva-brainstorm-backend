import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../src/shared/guards/jwt-auth.guard';

@ApiTags('canvas')
@Controller('canvas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CanvasGatewayController {
  constructor(
    @Inject('CANVAS_SERVICE') private readonly canvasService: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all canvases' })
  async findAll(@Query() query: any) {
    return this.canvasService.send('canvas.findAll', query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get canvas by ID' })
  async findOne(@Param('id') id: string) {
    return this.canvasService.send('canvas.findOne', { id });
  }

  @Post()
  @ApiOperation({ summary: 'Create new canvas' })
  async create(@Body() createCanvasDto: any) {
    return this.canvasService.send('canvas.create', createCanvasDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update canvas' })
  async update(@Param('id') id: string, @Body() updateCanvasDto: any) {
    return this.canvasService.send('canvas.update', { id, ...updateCanvasDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete canvas' })
  async remove(@Param('id') id: string) {
    return this.canvasService.send('canvas.remove', { id });
  }

  @Post(':id/shapes')
  @ApiOperation({ summary: 'Add shape to canvas' })
  async addShape(@Param('id') canvasId: string, @Body() shapeDto: any) {
    return this.canvasService.send('canvas.addShape', { canvasId, ...shapeDto });
  }

  @Put(':canvasId/shapes/:shapeId')
  @ApiOperation({ summary: 'Update shape in canvas' })
  async updateShape(
    @Param('canvasId') canvasId: string,
    @Param('shapeId') shapeId: string,
    @Body() updateShapeDto: any,
  ) {
    return this.canvasService.send('canvas.updateShape', {
      canvasId,
      shapeId,
      ...updateShapeDto,
    });
  }

  @Delete(':canvasId/shapes/:shapeId')
  @ApiOperation({ summary: 'Remove shape from canvas' })
  async removeShape(
    @Param('canvasId') canvasId: string,
    @Param('shapeId') shapeId: string,
  ) {
    return this.canvasService.send('canvas.removeShape', { canvasId, shapeId });
  }
}
