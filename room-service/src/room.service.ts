import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { Document } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { randomUUID } from 'crypto';

export type RoomDocument = Room & Document;

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<RoomDocument> {
    const shareableLinkKey = randomUUID();
    const createdRoom = new this.roomModel({
      name: createRoomDto.name,
      ownerId: createRoomDto.ownerId,
      shareableLinkKey,
      participants: [],
    });
    return createdRoom.save();
  }

  async getRoom(id: string): Promise<RoomDocument | null> {
    return this.roomModel.findById(id).exec();
  }

  async getAllRooms(): Promise<RoomDocument[]> {
    return this.roomModel.find().exec();
  }

  async addParticipant(roomId: string, addParticipantDto: AddParticipantDto): Promise<RoomDocument | null> {
    return this.roomModel.findByIdAndUpdate(
      roomId,
      { $addToSet: { participants: addParticipantDto.userId } },
      { new: true }
    ).exec();
  }

  async removeParticipant(roomId: string, userId: string): Promise<RoomDocument | null> {
    return this.roomModel.findByIdAndUpdate(
      roomId,
      { $pull: { participants: userId } },
      { new: true }
    ).exec();
  }

  async getParticipants(roomId: string): Promise<string[]> {
    const room = await this.roomModel.findById(roomId).exec() as RoomDocument | null;
    return room ? room.participants : [];
  }
}