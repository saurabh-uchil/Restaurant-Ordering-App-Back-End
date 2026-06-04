/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MenuType } from "../../enums/menuType.enum";
import { Course } from "../../enums/course.enum";
import { OptionGroup } from "src/menu/option-group/schema/OptionGroup.schema";
import { Addon } from "src/menu/addon/schema/Addons.schema";
import { DietaryAlternative } from "src/menu/dietary-alternatives/schema/DietaryAlternatives.schema";


@Schema({timestamps: true})
export class FoodItem extends Document {

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    price: number;

    @Prop({enum: MenuType, type: [String], required: true})
    menuType: MenuType[];

    @Prop()
    imageUrl: string;

    @Prop({enum: Course, type: String, required: true})
    course: Course;

    @Prop({type: [{type: Types.ObjectId, ref: OptionGroup.name}], default: []})
    options: Types.ObjectId[];

    @Prop({type:[{type: Types.ObjectId, ref: Addon.name}], default: []})
    addons: Types.ObjectId[];

    @Prop({default: []})
    removableIngredients: string[];

    @Prop({type: [{type: Types.ObjectId, ref: DietaryAlternative.name}], default: []})
    dietaryAlternatives: Types.ObjectId[];

    @Prop({required: true})
    availability: string[];

}

export const FoodItemSchema = SchemaFactory.createForClass(FoodItem);