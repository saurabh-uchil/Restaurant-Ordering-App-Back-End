/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schema/session.schema';
import { Model } from 'mongoose';
import { SessionDto } from './dto/session.dto';
import { randomBytes, createHash } from 'crypto';
import { Types } from 'mongoose';
import { SessionDevice } from './schema/session-device.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: Model<Session>,

    @InjectModel(SessionDevice.name)
    private sessionDeviceModel: Model<SessionDevice>,
  ) {}

  async getSession() {
    return await this.sessionModel.find().exec();
  }

  async createSession(sessionData: SessionDto) {
    const restaurantId = new Types.ObjectId(sessionData.restaurantId);
    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const status = 'active';

    const mongoSession = await this.sessionModel.db.startSession();

    try {
      await mongoSession.withTransaction(async () => {
        // 1. Create Session

        const session = await this.sessionModel.create({
          restaurantId,
          table: sessionData.table,
          status,
        });
        // 2. Create SessionDevice using the new Session ID
        const sessionDevice = await this.sessionDeviceModel.create({
          sessionId: session._id,
          hashedToken,
        });
        console.log('Session created:', session);
        console.log('SessionDevice created:', sessionDevice);
        return { session, token };
      });
    } finally {
      await mongoSession.endSession();
    }

    
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

  async findActiveSession(restaurantId: string, table: number) {
    const session = await this.sessionModel.findOne({
      restaurantId: new Types.ObjectId(restaurantId),
      table,
      status: 'active',
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });

    return session;
  }
}
