/* eslint-disable prettier/prettier */
import { Session } from '../session/schema/session.schema';

declare global {
  namespace Express {
    interface Request {
      diningSession?: Session;
    }
  }
}

export {};