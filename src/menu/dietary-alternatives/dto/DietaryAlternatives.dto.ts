/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsMongoId } from "class-validator";
import {IsOptional, IsNumber, IsString, Min } from "class-validator";

export class DietaryAlternativesDto {

    @IsOptional()
    @IsMongoId()
    id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    shortCode?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    additionalPrice?: number;
}