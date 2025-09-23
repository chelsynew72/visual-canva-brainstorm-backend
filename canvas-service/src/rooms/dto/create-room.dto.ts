import { IsString, IsBoolean, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  maxParticipants: number;
}
