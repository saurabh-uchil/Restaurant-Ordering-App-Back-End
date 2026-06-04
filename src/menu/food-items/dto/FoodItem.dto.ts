/* eslint-disable prettier/prettier */

import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested} from "class-validator";

import { Type } from "class-transformer";
import { MenuType } from "src/menu/enums/menuType.enum";
import { Course } from "src/menu/enums/course.enum";
import { OptionGroupDto } from "src/menu/option-group/dto/OptionGroup.dto";
import { AddonsDto } from "src/menu/addon/dto/Addons.dto";
import { DietaryAlternativesDto } from "src/menu/dietary-alternatives/dto/DietaryAlternatives.dto";


export class FoodItemDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsArray()
    @ArrayNotEmpty({ message: 'menu types should not be empty' })
    @IsEnum(MenuType, { each: true })
    menuType: MenuType[];

    @IsString()
    imageUrl: string;

    @IsNotEmpty()
    @IsEnum(Course)
    course: Course;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionGroupDto)
    options?: OptionGroupDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddonsDto)
    addons?: AddonsDto[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    removableIngredients?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DietaryAlternativesDto)
    dietaryAlternatives?: DietaryAlternativesDto[];

    @IsArray()
    @ArrayNotEmpty({ message: 'availability should not be empty' })
    @IsString({ each: true })
    availability?: string[];
}