/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "../enums/user.role.enum";
import { Document, Types } from "mongoose";
import { Restaurant } from "../../restaurant/schema/restaurant.schema";

@Schema({timestamps: true})
export class User extends Document {
    @Prop({required: true})
    username!: string;

    @Prop({required: true, unique:true})
    email!: string;

    @Prop({required: true, select: false})
    hashedPassword!: string;

    @Prop({required: true})
    role!: UserRole;

    @Prop()
    lastLogin!: Date;

    @Prop({type: Types.ObjectId, ref: Restaurant.name})
    restaurant!: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);