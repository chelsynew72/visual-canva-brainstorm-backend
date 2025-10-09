import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'userpresences' })
export class UserPresence extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
    index: true,
    description: 'Primary key: `${canvasId}_${userId}`',
  })
  @Prop({ required: true, type: String, index: true })
  canvasId: string; // foreign key referencing Room/Canvas

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  userName: string;

  @Prop({ type: Date, default: Date.now })
  lastSeen: Date;
}

export const UserPresenceSchema = SchemaFactory.createForClass(UserPresence);

UserPresenceSchema.index({ canvasId: 1, userId: 1 }, { unique: true });
