import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body('name') name: string) {
    return this.roomService.createRoom(name);
  }

  @Get(':id')
  getRoom(@Param('id') id: string) {
    return this.roomService.getRoom(id);
  }

  @Get()
  getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Post(':id/share')
  shareRoom(@Param('id') id: string) {
    const room = this.roomService.getRoom(id);
    return { sharableLink: room?.sharableLink };
  }

  @Get(':id/presence')
  getParticipants(@Param('id') id: string) {
    return this.roomService.getParticipants(id);
  }
}
