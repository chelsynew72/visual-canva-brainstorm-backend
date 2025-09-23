import { Controller, Get, Post, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../src/shared/guards/jwt-auth.guard';

@ApiTags('rooms')
@Controller('api/rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomsGatewayController {
  constructor(
    @Inject('CANVAS_SERVICE') private readonly canvasService: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  async findAll(@Query() query: any) {
    return this.canvasService.send('rooms.findAll', query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  async findOne(@Param('id') id: string) {
    return this.canvasService.send('rooms.findOne', { id });
  }

  @Post()
  @ApiOperation({ summary: 'Create new room' })
  async create(@Body() createRoomDto: any) {
    return this.canvasService.send('rooms.create', createRoomDto);
  }
}
