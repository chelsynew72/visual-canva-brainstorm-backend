import { ApiProperty } from '@nestjs/swagger';

export class RoomResponseDto {
  @ApiProperty({ example: '65f8d7c3a2...', description: 'Unique room ID' })
  _id: string;

  @ApiProperty({ example: 'Design Team Board' })
  name: string;

  @ApiProperty({ example: '65f8d7c3a2...', description: 'Owner user ID' })
  ownerId: string;

  @ApiProperty({ example: 'a1b2c3d4e5', description: 'Unique shareable link key' })
  shareableLinkKey: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
    description: 'List of drawings in the room',
  })
  drawings: any[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'IDs of participants currently in the room',
  })
  participants: string[];

  @ApiProperty({ example: '2025-10-04T10:20:30Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-04T11:15:45Z' })
  lastModifiedAt: Date;

  @ApiProperty({ example: 1696414872000, description: 'Materialized view timestamp' })
  asOf: number;
}
