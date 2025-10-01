import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const sharableLink = randomUUID();
    const createdRoom = new this.roomModel({
      name: createRoomDto.name,
      sharableLink,
      participants: [],
    });
    return createdRoom.save();
  }

  async getRoom(id: string): Promise<Room | null> {
    return this.roomModel.findById(id).exec();
  }

  async getAllRooms(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async addParticipant(roomId: string, addParticipantDto: AddParticipantDto): Promise<Room | null> {
    return this.roomModel.findByIdAndUpdate(
      roomId,
      { $addToSet: { participants: addParticipantDto.userId } },
      { new: true }
    ).exec();
  }

  async removeParticipant(roomId: string, userId: string): Promise<Room | null> {
    return this.roomModel.findByIdAndUpdate(
      roomId,
      { $pull: { participants: userId } },
      { new: true }
    ).exec();
  }

  async getParticipants(roomId: string): Promise<string[]> {
    const room = await this.roomModel.findById(roomId).exec();
    return room ? room.participants : [];
  }
}
