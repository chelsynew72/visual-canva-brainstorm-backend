
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum DrawingType {
  LINE = 'line',
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
}

export class DrawingDto {
  @ApiPropertyOptional({ example: 'd1a2b3c4', description: 'Unique ID for the drawing element' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ enum: DrawingType, description: 'Type of drawing element' })
  @IsOptional()
  @IsEnum(DrawingType)
  type?: DrawingType;

  @ApiPropertyOptional({ description: 'Coordinates of the shape' })
  @IsOptional()
  coordinates?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Style attributes (color, thickness, etc.)' })
  @IsOptional()
  style?: Record<string, any>;

  @ApiPropertyOptional({ example: 'user123', description: 'User who created this drawing' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'Updated Room Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: [DrawingDto], description: 'Updated list of drawings' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DrawingDto)
  drawings?: DrawingDto[];

  @ApiPropertyOptional({ type: [String], description: 'Updated list of participants' })
  @IsOptional()
  @IsArray()
  participants?: string[];
}
