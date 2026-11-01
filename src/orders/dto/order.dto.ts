/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CartItemDTO } from "./cart.dto";

export class OrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  items!: CartItemDTO[];
}
