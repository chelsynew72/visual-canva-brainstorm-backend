import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('shapes')
@Controller('shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shape template' })
  @ApiResponse({ status: 201, description: 'Shape template created successfully' })
  create(@Body() createShapeDto: any) {
    return this.shapesService.create(createShapeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shape templates' })
  @ApiResponse({ status: 200, description: 'Shape templates retrieved successfully' })
  findAll() {
    return this.shapesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shape template by ID' })
  @ApiParam({ name: 'id', description: 'Shape template ID' })
  @ApiResponse({ status: 200, description: 'Shape template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Shape template not found' })
  findOne(@Param('id') id: string) {
    return this.shapesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shape template' })
  @ApiParam({ name: 'id', description: 'Shape template ID' })
  @ApiResponse({ status: 200, description: 'Shape template updated successfully' })
  @ApiResponse({ status: 404, description: 'Shape template not found' })
  update(@Param('id') id: string, @Body() updateShapeDto: any) {
    return this.shapesService.update(id, updateShapeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete shape template' })
  @ApiParam({ name: 'id', description: 'Shape template ID' })
  @ApiResponse({ status: 200, description: 'Shape template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shape template not found' })
  remove(@Param('id') id: string) {
    return this.shapesService.remove(id);
  }
}
