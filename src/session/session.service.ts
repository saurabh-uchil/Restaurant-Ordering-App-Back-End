/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schema/session.schema';
import { Model } from 'mongoose';
import { SessionDto } from './dto/session.dto';
import { randomBytes, createHash } from 'crypto';
import { Types } from 'mongoose';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async getSession() {
    return await this.sessionModel.find().exec();
  }

  async createSession(sessionData: SessionDto) {
    const restaurantId = new Types.ObjectId(sessionData.restaurantId);
    console.log(
      'Creating session for restaurantId:',
      restaurantId,
      'and table:',
      sessionData.table,
    );
    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const status = 'active';
    const session = await this.sessionModel.create({
      restaurantId,
      table: sessionData.table,
      status,
      hashedToken,
    });
    return { session, token };
  }

  async isValid(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const session = await this.sessionModel.findOne({ hashedToken });

    if (!session) {
      throw new UnauthorizedException('Invalid dining session');
    }

    if (session.status !== 'active') {
      throw new UnauthorizedException('Dining session is not active');
    }

    if (session.expiresAt && session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Dining session expired');
    }

    return session;
  }
}
