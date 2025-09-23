import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: true })
  isPublic: boolean;

  @Prop()
  password?: string;

  @Prop({ required: true, default: 10 })
  maxParticipants: number;

  @Prop({ required: true, default: 0 })
  currentParticipants: number;

  @Prop({ required: true })
  createdBy: string; // User ID from JWT

  @Prop({ type: [String], default: [] })
  participants: string[]; // Array of user IDs

  @Prop({ required: true, default: true })
  isActive: boolean;

  // Timestamp fields (automatically added by Mongoose when timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
export type RoomDocument = Room & Document;
