/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Addon extends Document {
    
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    price: number;
}

export const AddonSchema = SchemaFactory.createForClass(Addon);