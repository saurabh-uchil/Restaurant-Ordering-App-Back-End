/* eslint-disable prettier/prettier */

import { UserRole } from "../../user/enums/user.role.enum";
import{ Request } from "express";

export type JWTPayload = {
  sub: string,
  role: UserRole,
  restaurantId : string
}

export type AuthRequest = Request & { payload?: JWTPayload };