/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ required: true })
  sessionId!: string;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId!: Types.ObjectId;

  @Prop({ required: true })
  table!: number;

  @Prop({ required: true })
  status!: string;

  @Prop({ required: true,  select: false })
  hashedToken!: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
