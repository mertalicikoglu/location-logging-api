import { IsString, IsNumber } from 'class-validator';

export class LocationDto {
  @IsString()
  userId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}