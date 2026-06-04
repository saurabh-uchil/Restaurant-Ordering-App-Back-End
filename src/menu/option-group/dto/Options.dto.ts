/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class OptionsDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    extraCost?: number;
}