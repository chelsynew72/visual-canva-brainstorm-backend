/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto, userId: string) {
    const roomId = uuidv4();
    
    const room = new this.roomModel({
      ...createRoomDto,
      createdBy: userId,
      participants: [userId],
      currentParticipants: 1,
    });

    const savedRoom = await room.save();

    // Generate shareable link
    const shareableLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/room/${savedRoom._id}`;

    return {
      roomId: savedRoom._id,
      name: savedRoom.name,
      description: savedRoom.description,
      isPublic: savedRoom.isPublic,
      maxParticipants: savedRoom.maxParticipants,
      currentParticipants: savedRoom.currentParticipants,
      shareableLink,
      createdAt: savedRoom.createdAt,
    };
  }

  async findAll(userId?: string) {
    const query: any = { isActive: true };
    
    // If userId is provided, find rooms the user created or participates in
    if (userId) {
      query.$or = [
        { createdBy: userId },
        { participants: { $in: [userId] } }
      ];
    } else {
      // If no userId, only show public rooms
      query.isPublic = true;
    }

    const rooms = await this.roomModel.find(query).sort({ createdAt: -1 });
    
    return rooms.map(room => ({
      roomId: room._id,
      name: room.name,
      description: room.description,
      isPublic: room.isPublic,
      maxParticipants: room.maxParticipants,
      currentParticipants: room.currentParticipants,
      createdBy: room.createdBy,
      createdAt: room.createdAt,
    }));
  }

  async findOne(id: string, userId?: string) {
    const room = await this.roomModel.findById(id);
    
    if (!room || !room.isActive) {
      return null;
    }

    // Check if user has access to private rooms
    if (!room.isPublic && userId && !room.participants.includes(userId)) {
      return null;
    }

    return {
      roomId: room._id,
      name: room.name,
      description: room.description,
      isPublic: room.isPublic,
      maxParticipants: room.maxParticipants,
      currentParticipants: room.currentParticipants,
      participants: room.participants,
      createdBy: room.createdBy,
      createdAt: room.createdAt,
    };
  }

  async joinRoom(roomId: string, userId: string, password?: string) {
    const room = await this.roomModel.findById(roomId);
    
    if (!room || !room.isActive) {
      throw new Error('Room not found');
    }

    if (!room.isPublic && room.password !== password) {
      throw new Error('Invalid password');
    }

    if (room.currentParticipants >= room.maxParticipants) {
      throw new Error('Room is full');
    }

    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      room.currentParticipants = room.participants.length;
      await room.save();
    }

    return {
      roomId: room._id,
      name: room.name,
      description: room.description,
      isPublic: room.isPublic,
      maxParticipants: room.maxParticipants,
      currentParticipants: room.currentParticipants,
    };
  }

  async leaveRoom(roomId: string, userId: string) {
    const room = await this.roomModel.findById(roomId);
    
    if (!room) {
      throw new Error('Room not found');
    }

    room.participants = room.participants.filter(id => id !== userId);
    room.currentParticipants = room.participants.length;
    
    // If room is empty, deactivate it
    if (room.participants.length === 0) {
      room.isActive = false;
    }
    
    await room.save();
    
    return { success: true };
  }
}
