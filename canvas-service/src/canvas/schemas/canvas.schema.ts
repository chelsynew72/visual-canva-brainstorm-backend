import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CanvasDocument = Canvas & Document;

@Schema({ timestamps: true })
export class Canvas {
  @Prop({ required: true, unique: true })
  canvasId: string;

  @Prop({ required: true })
  roomId: string;

  @Prop({ default: 'Untitled Canvas' })
  name: string;

  @Prop({
    type: {
      background: {
        color: { type: String, default: '#ffffff' },
        pattern: { type: String, default: 'none' },
        patternSize: { type: Number, default: 20 },
      },
      viewport: {
        zoom: { type: Number, default: 1, min: 0.1, max: 10 },
        panX: { type: Number, default: 0 },
        panY: { type: Number, default: 0 },
      },
      dimensions: {
        width: { type: Number, default: 2000 },
        height: { type: Number, default: 1500 },
      },
      permissions: {
        allowDrawing: { type: Boolean, default: true },
        allowShapes: { type: Boolean, default: true },
        allowText: { type: Boolean, default: true },
        allowDelete: { type: Boolean, default: true },
      },
    },
    default: {},
  })
  settings: {
    background: {
      color: string;
      pattern: string;
      patternSize: number;
    };
    viewport: {
      zoom: number;
      panX: number;
      panY: number;
    };
    dimensions: {
      width: number;
      height: number;
    };
    permissions: {
      allowDrawing: boolean;
      allowShapes: boolean;
      allowText: boolean;
      allowDelete: boolean;
    };
  };

  @Prop({ type: [Object], default: [] })
  shapes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    dimensions?: { width: number; height: number };
    style: {
      fillColor: string;
      strokeColor: string;
      strokeWidth: number;
      opacity: number;
    };
    content?: {
      text: string;
      fontSize: number;
      fontFamily: string;
    };
    path?: Array<{ x: number; y: number }>;
    rotation: number;
    locked: boolean;
    visible: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  @Prop({ default: 1 })
  version: number;

  @Prop({ default: Date.now })
  lastModified: Date;

  @Prop()
  modifiedBy: string;

  @Prop({ type: [Object], default: [] })
  history: Array<{
    action: string;
    shapeId: string | null;
    timestamp: Date;
    userId: string;
    data: any;
  }>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CanvasSchema = SchemaFactory.createForClass(Canvas);

// Indexes for performance
CanvasSchema.index({ roomId: 1 });
CanvasSchema.index({ lastModified: -1 });
CanvasSchema.index({ 'shapes.id': 1 });
CanvasSchema.index({ createdAt: -1 });

// Generate unique canvas ID
CanvasSchema.statics.generateCanvasId = function () {
  return 'canvas_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
