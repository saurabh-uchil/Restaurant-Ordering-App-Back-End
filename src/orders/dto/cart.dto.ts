/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { SelectedItemDTO } from "./selectedItem.dto";

export class CartItemDTO {
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedItemDTO)
  addons!: SelectedItemDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedItemDTO)
  dietaryAlternatives!: SelectedItemDTO[];

  @IsArray()
  @IsString({ each: true })
  removableIngredients!: string[];

  @IsObject()
  options!: Record<string, SelectedItemDTO>;
}