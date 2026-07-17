/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from "class-validator";

export class RegisterUserDto {
    @IsString()
    username!: string;

    @IsString()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    restaurantName!: string;

    @IsString()
    restaurantDescription!: string;
}