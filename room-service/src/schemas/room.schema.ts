import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class Drawing {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, enum: ['line', 'circle', 'rectangle'] })
  type: string;

  @Prop({ type: Object, required: true })
  coordinates: Record<string, any>;

  @Prop({ type: Object })
  style?: Record<string, any>;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema()
export class Room extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true, unique: true })
  shareableLinkKey: string;

  @Prop({ type: [Drawing], default: [] })
  drawings: Drawing[];

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  lastModifiedAt: Date;

  @Prop()
  asOf?: number;
}

export const DrawingSchema = SchemaFactory.createForClass(Drawing);
export const RoomSchema = SchemaFactory.createForClass(Room);
