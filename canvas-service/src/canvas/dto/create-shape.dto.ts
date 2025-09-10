import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class ShapePositionDto {
  @ApiProperty({ description: 'X coordinate', example: 100 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y coordinate', example: 150 })
  @IsNumber()
  y: number;
}

export class ShapeDimensionsDto {
  @ApiProperty({ description: 'Shape width', example: 200 })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'Shape height', example: 100 })
  @IsNumber()
  height: number;
}

export class ShapeStyleDto {
  @ApiProperty({ description: 'Fill color', example: '#ff0000' })
  @IsString()
  fillColor: string;

  @ApiProperty({ description: 'Stroke color', example: '#000000' })
  @IsString()
  strokeColor: string;

  @ApiProperty({ description: 'Stroke width', example: 2 })
  @IsNumber()
  strokeWidth: number;

  @ApiProperty({ description: 'Opacity (0-1)', example: 1.0, minimum: 0, maximum: 1 })
  @IsNumber()
  opacity: number;
}

export class ShapeContentDto {
  @ApiProperty({ description: 'Text content', example: 'Hello World', required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ description: 'Font size', example: 16, required: false })
  @IsOptional()
  @IsNumber()
  fontSize?: number;

  @ApiProperty({ description: 'Font family', example: 'Arial', required: false })
  @IsOptional()
  @IsString()
  fontFamily?: string;
}

export class PathPointDto {
  @ApiProperty({ description: 'X coordinate', example: 50 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y coordinate', example: 75 })
  @IsNumber()
  y: number;
}

export class CreateShapeDto {
  @ApiProperty({ description: 'Shape type', example: 'rectangle', enum: ['rectangle', 'circle', 'line', 'text', 'freehand'] })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Shape position', type: ShapePositionDto })
  @ValidateNested()
  @Type(() => ShapePositionDto)
  position: ShapePositionDto;

  @ApiProperty({ description: 'Shape dimensions', type: ShapeDimensionsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShapeDimensionsDto)
  dimensions?: ShapeDimensionsDto;

  @ApiProperty({ description: 'Shape style properties', type: ShapeStyleDto })
  @ValidateNested()
  @Type(() => ShapeStyleDto)
  style: ShapeStyleDto;

  @ApiProperty({ description: 'Text content for text shapes', type: ShapeContentDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShapeContentDto)
  content?: ShapeContentDto;

  @ApiProperty({ description: 'Path points for freehand shapes', type: [PathPointDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PathPointDto)
  path?: PathPointDto[];

  @ApiProperty({ description: 'Shape rotation in degrees', example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  rotation?: number;

  @ApiProperty({ description: 'Whether shape is locked', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  locked?: boolean;

  @ApiProperty({ description: 'Whether shape is visible', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
