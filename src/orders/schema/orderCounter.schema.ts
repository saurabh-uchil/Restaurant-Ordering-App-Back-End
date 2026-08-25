/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class OrderCounter extends Document {
  @Prop({type: Types.ObjectId, ref: 'Restaurant', required: true})
  restaurantId!: Types.ObjectId;

  @Prop({type: Number,required: true, default: 1000})
  sequence!: number;
}

export const OrderCounterSchema = SchemaFactory.createForClass(OrderCounter);