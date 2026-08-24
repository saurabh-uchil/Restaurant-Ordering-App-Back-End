/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class SelectedItemDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  extraCost!: number;
}