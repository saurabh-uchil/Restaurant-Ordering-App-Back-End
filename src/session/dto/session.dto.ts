/* eslint-disable prettier/prettier */
import { IsInt, IsMongoId, IsNumber, Min } from "class-validator";

export class SessionDto {
  @IsMongoId()
  restaurantId!: string;
  
  @IsNumber()
  @IsInt()
  @Min(1)
  table!: number;
}
