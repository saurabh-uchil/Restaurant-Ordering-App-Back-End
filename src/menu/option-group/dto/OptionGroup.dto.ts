/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { OptionsDto } from "./Options.dto";

export class OptionGroupDto {

    //user can send id of the existing option group

    @IsMongoId()
    @IsOptional()
    id?: string;


    //user can also send the details to create a new option group
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionsDto)
    choices?: OptionsDto[];
}