/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from "class-validator";

export class CreateRestaurantDto {
    @IsString()
    name!: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    description!: string;

    @IsString({ each: true })
    @IsOptional()
    typeOfCuisine?: string[];

    @IsString()
    @IsOptional()
    timings?: string;
}