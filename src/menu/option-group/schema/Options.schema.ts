/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Options extends Document {

    @Prop({required: true})
    name: string;

    @Prop()
    extraCost: number;

}

export const OptionsSchema = SchemaFactory.createForClass(Options);
