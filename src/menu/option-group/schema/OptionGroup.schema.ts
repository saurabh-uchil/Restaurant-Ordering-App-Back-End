/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Options } from "./Options.schema";

@Schema({timestamps: true})
export class OptionGroup extends Document{  
    
    @Prop({required: true})
    name: string;

    @Prop({required: true, type: [{ type: Types.ObjectId, ref: Options.name }]})
    choices: Types.ObjectId[];

}

export const OptionGroupSchema = SchemaFactory.createForClass(OptionGroup);