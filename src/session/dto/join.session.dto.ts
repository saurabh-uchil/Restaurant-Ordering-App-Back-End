/* eslint-disable prettier/prettier */

import { IsMongoId } from 'class-validator';

export class JoinSessionDto {
  @IsMongoId()
  sessionId!: string;
}
