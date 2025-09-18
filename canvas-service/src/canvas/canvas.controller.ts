import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import { CanvasFilterDto } from './dto/canvas-filter.dto';
import { CanvasResponseDto } from './dto/canvas-response.dto';
import { CreateShapeDto } from './dto/create-shape.dto';
import { UpdateShapeDto } from './dto/update-shape.dto';

@ApiTags('canvas')
@Controller('canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  // HTTP REST Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new canvas' })
  @ApiResponse({ 
    status: 201, 
    description: 'Canvas created successfully',
    type: CanvasResponseDto 
  })
  @ApiBearerAuth()
  async create(
    @Body() createCanvasDto: CreateCanvasDto,
    @Request() req: any,
  ): Promise<CanvasResponseDto> {
    const userId = req.user?.id;
    return this.canvasService.create(createCanvasDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all canvases with filtering' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of canvases',
    type: [CanvasResponseDto] 
  })
  async findAll(
    @Query() filterDto: CanvasFilterDto,
  ): Promise<{ canvases: CanvasResponseDto[]; total: number; page: number; limit: number }> {
    return this.canvasService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get canvas by ID' })
  @ApiParam({ name: 'id', description: 'Canvas ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Canvas found',
    type: CanvasResponseDto 
  })
  async findOne(@Param('id') id: string): Promise<CanvasResponseDto> {
    return this.canvasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update canvas' })
  @ApiParam({ name: 'id', description: 'Canvas ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Canvas updated successfully',
    type: CanvasResponseDto 
  })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateCanvasDto: UpdateCanvasDto,
    @Request() req: any,
  ): Promise<CanvasResponseDto> {
    const userId = req.user?.id;
    return this.canvasService.update(id, updateCanvasDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete canvas' })
  @ApiParam({ name: 'id', description: 'Canvas ID' })
  @ApiResponse({ status: 200, description: 'Canvas deleted successfully' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.canvasService.remove(id);
    return { message: 'Canvas deleted successfully' };
  }

  // Microservice Message Patterns
  @MessagePattern('canvas.create')
  async createCanvas(@Payload() data: { createCanvasDto: CreateCanvasDto; userId: string }) {
    return this.canvasService.create(data.createCanvasDto, data.userId);
  }

  @MessagePattern('canvas.findAll')
  async findAllCanvases(@Payload() filterDto: CanvasFilterDto) {
    return this.canvasService.findAll(filterDto);
  }

  @MessagePattern('canvas.findOne')
  async findOneCanvas(@Payload() data: { id: string }) {
    return this.canvasService.findOne(data.id);
  }

  @MessagePattern('canvas.update')
  async updateCanvas(@Payload() data: { id: string; updateCanvasDto: UpdateCanvasDto; userId: string }) {
    return this.canvasService.update(data.id, data.updateCanvasDto, data.userId);
  }

  @MessagePattern('canvas.remove')
  async removeCanvas(@Payload() data: { id: string }) {
    await this.canvasService.remove(data.id);
    return { message: 'Canvas deleted successfully' };
  }

  // Shape Management HTTP Endpoints
  @Post(':canvasId/shapes')
  @ApiOperation({ summary: 'Add shape to canvas' })
  @ApiParam({ name: 'canvasId', description: 'Canvas ID' })
  @ApiBody({ type: CreateShapeDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Shape added successfully',
    type: CanvasResponseDto 
  })
  @ApiBearerAuth()
  async addShape(
    @Param('canvasId') canvasId: string,
    @Body() createShapeDto: CreateShapeDto,
    @Request() req: any,
  ): Promise<CanvasResponseDto> {
    const userId = req.user?.id || 'anonymous';
    return this.canvasService.addShape(canvasId, createShapeDto, userId);
  }

  @Get(':canvasId/shapes/:shapeId')
  @ApiOperation({ summary: 'Get specific shape from canvas' })
  @ApiParam({ name: 'canvasId', description: 'Canvas ID' })
  @ApiParam({ name: 'shapeId', description: 'Shape ID' })
  @ApiResponse({ status: 200, description: 'Shape retrieved successfully' })
  @ApiBearerAuth()
  async getShape(
    @Param('canvasId') canvasId: string,
    @Param('shapeId') shapeId: string,
  ): Promise<any> {
    return this.canvasService.getShape(canvasId, shapeId);
  }

  @Patch(':canvasId/shapes/:shapeId')
  @ApiOperation({ summary: 'Update shape on canvas' })
  @ApiParam({ name: 'canvasId', description: 'Canvas ID' })
  @ApiParam({ name: 'shapeId', description: 'Shape ID' })
  @ApiBody({ type: UpdateShapeDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Shape updated successfully',
    type: CanvasResponseDto 
  })
  @ApiBearerAuth()
  async updateShape(
    @Param('canvasId') canvasId: string,
    @Param('shapeId') shapeId: string,
    @Body() updateShapeDto: UpdateShapeDto,
    @Request() req: any,
  ): Promise<CanvasResponseDto> {
    const userId = req.user?.id || 'anonymous';
    return this.canvasService.updateShape(canvasId, shapeId, updateShapeDto, userId);
  }

  @Delete(':canvasId/shapes/:shapeId')
  @ApiOperation({ summary: 'Remove shape from canvas' })
  @ApiParam({ name: 'canvasId', description: 'Canvas ID' })
  @ApiParam({ name: 'shapeId', description: 'Shape ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Shape removed successfully',
    type: CanvasResponseDto 
  })
  @ApiBearerAuth()
  async removeShape(
    @Param('canvasId') canvasId: string,
    @Param('shapeId') shapeId: string,
    @Request() req: any,
  ): Promise<CanvasResponseDto> {
    const userId = req.user?.id || 'anonymous';
    return this.canvasService.removeShape(canvasId, shapeId, userId);
  }

  // Shape Management Message Patterns
  @MessagePattern('canvas.shape.add')
  async addShapeMessage(@Payload() data: { canvasId: string; createShapeDto: CreateShapeDto; userId: string }) {
    return this.canvasService.addShape(data.canvasId, data.createShapeDto, data.userId);
  }

  @MessagePattern('canvas.shape.get')
  async getShapeMessage(@Payload() data: { canvasId: string; shapeId: string }) {
    return this.canvasService.getShape(data.canvasId, data.shapeId);
  }

  @MessagePattern('canvas.shape.update')
  async updateShapeMessage(@Payload() data: { canvasId: string; shapeId: string; updateShapeDto: UpdateShapeDto; userId: string }) {
    return this.canvasService.updateShape(data.canvasId, data.shapeId, data.updateShapeDto, data.userId);
  }

  @MessagePattern('canvas.shape.remove')
  async removeShapeMessage(@Payload() data: { canvasId: string; shapeId: string; userId: string }) {
    return this.canvasService.removeShape(data.canvasId, data.shapeId, data.userId);
  }
}
