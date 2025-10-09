/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Controller('api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req: AuthenticatedRequest) {
    const room = await this.roomsService.create(createRoomDto, req.user.id);
    return { room };
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.roomsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-rooms')
  async findMyRooms(@Request() req: AuthenticatedRequest) {
    return this.roomsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.roomsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinRoom(
    @Param('id') roomId: string,
    @Body('password') password: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.roomsService.joinRoom(roomId, req.user.id, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leaveRoom(
    @Param('id') roomId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.roomsService.leaveRoom(roomId, req.user.id);
  }

  // Microservice handlers for gateway
  @MessagePattern('rooms.create')
  async msCreate(@Payload() data: { createRoomDto: CreateRoomDto; userId: string }) {
    return this.roomsService.create(data.createRoomDto, data.userId);
  }

  @MessagePattern('rooms.findAll')
  async msFindAll(@Payload() data: { userId?: string }) {
    return this.roomsService.findAll(data.userId);
  }

  @MessagePattern('rooms.findOne')
  async msFindOne(@Payload() data: { id: string; userId?: string }) {
    return this.roomsService.findOne(data.id, data.userId);
  }

  @MessagePattern('rooms.join')
  async msJoin(@Payload() data: { roomId: string; userId: string; password?: string }) {
    return this.roomsService.joinRoom(data.roomId, data.userId, data.password);
  }

  @MessagePattern('rooms.leave')
  async msLeave(@Payload() data: { roomId: string; userId: string }) {
    return this.roomsService.leaveRoom(data.roomId, data.userId);
  }
}
