import { IsString, IsOptional, IsObject, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BackgroundSettingsDto {
  @ApiPropertyOptional({ example: '#ffffff' })
  @IsOptional()
  @IsString()
  color?: string = '#ffffff';

  @ApiPropertyOptional({ example: 'none' })
  @IsOptional()
  @IsString()
  pattern?: string = 'none';

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  patternSize?: number = 20;
}

export class ViewportSettingsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  zoom?: number = 1;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  panX?: number = 0;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  panY?: number = 0;
}

export class DimensionsDto {
  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @IsNumber()
  width?: number = 2000;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber()
  height?: number = 1500;
}

export class PermissionsDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  allowDrawing?: boolean = true;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  allowShapes?: boolean = true;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  allowText?: boolean = true;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  allowDelete?: boolean = true;
}

export class CanvasSettingsDto {
  @ApiPropertyOptional({ type: BackgroundSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BackgroundSettingsDto)
  background?: BackgroundSettingsDto;

  @ApiPropertyOptional({ type: ViewportSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ViewportSettingsDto)
  viewport?: ViewportSettingsDto;

  @ApiPropertyOptional({ type: DimensionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @ApiPropertyOptional({ type: PermissionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PermissionsDto)
  permissions?: PermissionsDto;
}

export class CreateCanvasDto {
  @ApiProperty({ example: 'room_123' })
  @IsString()
  roomId: string;

  @ApiPropertyOptional({ example: 'My Awesome Canvas' })
  @IsOptional()
  @IsString()
  name?: string = 'Untitled Canvas';

  @ApiPropertyOptional({ type: CanvasSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanvasSettingsDto)
  settings?: CanvasSettingsDto;
}
