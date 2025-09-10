import { ApiProperty } from '@nestjs/swagger';

export class CanvasResponseDto {
  @ApiProperty({
    description: 'MongoDB document ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Unique canvas identifier',
    example: 'canvas_1234567890_abc123',
  })
  canvasId: string;

  @ApiProperty({
    description: 'Associated room ID',
    example: 'room_1234567890_def456',
  })
  roomId: string;

  @ApiProperty({
    description: 'Canvas name',
    example: 'My Brainstorming Canvas',
  })
  name: string;

  @ApiProperty({
    description: 'Canvas settings',
    example: {
      background: { color: '#ffffff', pattern: 'grid', patternSize: 20 },
      viewport: { zoom: 1.0, panX: 0, panY: 0 },
      dimensions: { width: 2000, height: 1500 },
      permissions: { allowDrawing: true, allowShapes: true, allowText: true, allowDelete: true },
    },
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

  @ApiProperty({
    description: 'Array of shapes on the canvas',
    isArray: true,
    example: [],
  })
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
      text?: string;
      fontSize?: number;
      fontFamily?: string;
    };
    path?: Array<{ x: number; y: number }>;
    rotation: number;
    locked: boolean;
    visible: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  @ApiProperty({
    description: 'Canvas version number',
    example: 5,
  })
  version: number;

  @ApiProperty({
    description: 'User ID who last modified the canvas',
    example: 'user123',
  })
  modifiedBy: string;

  @ApiProperty({
    description: 'Timestamp of last modification',
    type: 'string',
    format: 'date-time',
  })
  lastModified: Date;

  @ApiProperty({
    description: 'Canvas creation timestamp',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Canvas modification history',
    isArray: true,
    example: [],
  })
  history: Array<{
    action: string;
    shapeId: string | null;
    timestamp: Date;
    userId: string;
    data: any;
  }>;
}
