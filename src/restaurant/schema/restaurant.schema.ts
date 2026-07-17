/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Restaurant extends Document{
    @Prop({required: true, unique: true})
    name!: string;

    @Prop()
    address!: string;

    @Prop()
    phoneNumber!: string;

    @Prop({required: true})
    description!: string;

    @Prop()
    typeOfCuisine!: string[];

    @Prop()
    timings! : string;

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);