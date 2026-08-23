/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { CartItemDTO } from "./cart.dto";

export class OrderDTO {
  @IsString()
  restaurantId!: string;

  @IsNumber()
  table!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  cart!: CartItemDTO[];
}