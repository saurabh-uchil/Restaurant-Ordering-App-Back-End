/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class SessionCredential {
  @Prop({ required: true, select: false })
  hashedToken!: string;

  @Prop({ required: true })
  createdAt!: Date;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ type: Date, default: null })
  revokedAt!: Date | null;
}

const SessionCredentialSchema = SchemaFactory.createForClass(SessionCredential);

@Schema({ timestamps: true })
export class Session extends Document {

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId!: Types.ObjectId;

  @Prop({ required: true })
  table!: number;

  @Prop({ required: true })
  status!: string;

  // Legacy single-device token hash. Kept so existing sessions remain valid.
  @Prop({ required: false, select: false })
  hashedToken?: string;

  @Prop({ type: [SessionCredentialSchema], default: [], select: false })
  credentials!: SessionCredential[];

  @Prop({type: Date, default: null})
  expiresAt!: Date | null;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index(
  { restaurantId: 1, table: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
    name: 'one_active_session_per_restaurant_table',
  },
);

SessionSchema.index(
  { 'credentials.hashedToken': 1 },
  {
    unique: true,
    partialFilterExpression: { 'credentials.hashedToken': { $exists: true } },
    name: 'unique_session_device_token_hash',
  },
);
