/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { CartItemDTO } from "./cart.dto";

export class OrderDTO {
  @IsString()
  restaurantId!: string;

  @IsString()
  table!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  items!: CartItemDTO[];
}