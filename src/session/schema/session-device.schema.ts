/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class SessionDevice extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Session',
    required: true,
  })
  sessionId!: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    select: false,
  })
  hashedToken!: string;

  @Prop({ type: Date, default: null })
  revokedAt!: Date | null;
}

export const SessionDeviceSchema =
  SchemaFactory.createForClass(SessionDevice);