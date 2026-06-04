/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class DietaryAlternative extends Document {
    
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    shortCode: string;  

    @Prop({default: 0})
    additionalPrice: number;
}

export const DietaryAlternativeSchema = SchemaFactory.createForClass(DietaryAlternative);