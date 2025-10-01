import { Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class RoomService {
  private rooms: Room[] = [];

  createRoom(name: string): Room {
    const room: Room = {
      id: randomUUID(),
      name,
      createdAt: new Date(),
      sharableLink: this.generateSharableLink(),
      participants: [],
    };
    this.rooms.push(room);
    return room;
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.find(room => room.id === id);
  }

  getAllRooms(): Room[] {
    return this.rooms;
  }

  generateSharableLink(): string {
    return randomUUID();
  }

  addParticipant(roomId: string, userId: string) {
    const room = this.getRoom(roomId);
    if (room && !room.participants.includes(userId)) {
      room.participants.push(userId);
    }
  }

  removeParticipant(roomId: string, userId: string) {
    const room = this.getRoom(roomId);
    if (room) {
      room.participants = room.participants.filter(id => id !== userId);
    }
  }

  getParticipants(roomId: string): string[] {
    const room = this.getRoom(roomId);
    return room ? room.participants : [];
  }
}
