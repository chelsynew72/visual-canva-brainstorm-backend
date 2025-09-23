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

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req: AuthenticatedRequest) {
    const room = await this.roomsService.create(createRoomDto, req.user.userId);
    return { room };
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.roomsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-rooms')
  async findMyRooms(@Request() req: AuthenticatedRequest) {
    return this.roomsService.findAll(req.user.userId);
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
    return this.roomsService.joinRoom(roomId, req.user.userId, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leaveRoom(
    @Param('id') roomId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.roomsService.leaveRoom(roomId, req.user.userId);
  }
}
