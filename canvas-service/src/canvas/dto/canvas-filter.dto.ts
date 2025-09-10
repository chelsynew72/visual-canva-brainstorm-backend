import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CanvasFilterDto {
  @ApiPropertyOptional({ example: 'My Canvas' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'room123' })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ 
    example: 'createdAt',
    description: 'Sort by field' 
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ 
    enum: ['asc', 'desc'],
    example: 'desc'
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
