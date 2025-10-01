import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AddParticipantDto } from './dto/add-participant.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    return this.roomService.getRoom(id);
  }

  @Get()
  async getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Post(':id/add-participant')
  async addParticipant(@Param('id') id: string, @Body() addParticipantDto: AddParticipantDto) {
    return this.roomService.addParticipant(id, addParticipantDto);
  }

  @Post(':id/remove-participant')
  async removeParticipant(@Param('id') id: string, @Body('userId') userId: string) {
    return this.roomService.removeParticipant(id, userId);
  }

  @Get(':id/presence')
  async getParticipants(@Param('id') id: string) {
    return this.roomService.getParticipants(id);
  }
}
