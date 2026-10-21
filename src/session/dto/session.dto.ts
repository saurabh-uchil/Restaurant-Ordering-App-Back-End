/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from "class-validator";

export class SessionDto {
  @IsString()
  restaurantId!: string;
  
  @IsNumber()
  table!: number;
}