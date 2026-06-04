/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsOptional, IsNumber, IsString, Min, IsMongoId } from "class-validator";

export class AddonsDto {

    @IsOptional()
    @IsMongoId()
    id?: string;

    @IsOptional()
    @IsString() 
    name?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;
    
}