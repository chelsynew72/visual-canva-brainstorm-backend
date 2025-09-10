import { PartialType } from '@nestjs/swagger';
import { CreateCanvasDto } from './create-canvas.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCanvasDto extends PartialType(CreateCanvasDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modifiedBy?: string;
}
