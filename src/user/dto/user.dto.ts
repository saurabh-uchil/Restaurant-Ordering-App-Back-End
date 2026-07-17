/* eslint-disable prettier/prettier */
import { IsDate, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { UserRole } from "../enums/user.role.enum";

export class CreateUserDto {
    @IsString()
    username!: string;

    @IsString()
    email!: string;

    @IsString()
    hashedPassword!: string;

    @IsEnum(UserRole)
    role!: UserRole;

    @IsDate()
    @IsOptional()
    lastLogin?: Date;

    @IsMongoId()
    restaurant?: string;
}