/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schema/session.schema';
import { Model, Types } from 'mongoose';
import { SessionDto } from './dto/session.dto';
import { randomBytes, createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private readonly configService: ConfigService,
  ) {}

  async getSession() {
    return this.sessionModel.find().exec();
  }

  async hasActiveSession(restaurantId: string, table: number): Promise<boolean> {
    const now = new Date();
    const session = await this.sessionModel.exists({
      restaurantId: new Types.ObjectId(restaurantId),
      table,
      status: 'active',
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    });
    return Boolean(session);
  }

  async createSession(sessionData: SessionDto) {
    const restaurantId = new Types.ObjectId(sessionData.restaurantId);
    const now = new Date();
    const maxAge = this.configService.getOrThrow<number>('SESSION_COOKIE_MAX_AGE');
    const expiresAt = new Date(now.getTime() + maxAge);
    const token = this.createToken();

    // Release the unique active-table slot held by expired sessions before creating a new one.
    await this.sessionModel.updateMany(
      {
        restaurantId,
        table: sessionData.table,
        status: 'active',
        expiresAt: { $lte: now },
      },
      { $set: { status: 'expired' } },
    );

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const [session] = await this.sessionModel.create([
          {
            restaurantId,
            table: sessionData.table,
            status: 'active',
            credentials: [{
              hashedToken: this.hashToken(token),
              createdAt: now,
              expiresAt,
              revokedAt: null,
            }],
            expiresAt,
          },
        ]);
        return { session, token, cookieMaxAge: maxAge };
      } catch (error) {
        if (!this.isDuplicateKeyError(error)) throw error;

        // The competing session might have expired between cleanup and insertion.
        await this.sessionModel.updateMany(
          {
            restaurantId,
            table: sessionData.table,
            status: 'active',
            expiresAt: { $lte: new Date() },
          },
          { $set: { status: 'expired' } },
        );
        if (attempt === 1) {
          throw new ConflictException('An active dining session already exists for this table');
        }
      }
    }

    throw new ConflictException('An active dining session already exists for this table');
  }

  async joinSession(sessionData: SessionDto) {
    const now = new Date();
    const maxAge = this.configService.getOrThrow<number>('SESSION_COOKIE_MAX_AGE');
    const token = this.createToken();
    const credentialExpiresAt = new Date(now.getTime() + maxAge);

    const session = await this.sessionModel.findOneAndUpdate(
      {
        restaurantId: new Types.ObjectId(sessionData.restaurantId),
        table: sessionData.table,
        status: 'active',
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      },
      {
        $push: {
          credentials: {
            hashedToken: this.hashToken(token),
            createdAt: now,
            expiresAt: credentialExpiresAt,
            revokedAt: null,
          },
        },
      },
      { new: true, runValidators: true },
    );

    if (!session) {
      throw new ConflictException('There is no active dining session for this table. Start a new order instead.');
    }

    const remainingSessionTime = session.expiresAt
      ? Math.max(0, session.expiresAt.getTime() - now.getTime())
      : maxAge;

    return {
      session,
      token,
      cookieMaxAge: Math.min(maxAge, remainingSessionTime),
    };
  }

  async isValid(token: string): Promise<Session> {
    const now = new Date();
    const hashedToken = this.hashToken(token);
    const session = await this.sessionModel
      .findOne({
        status: 'active',
        $and: [
          { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
          {
            $or: [
              // Existing sessions use this legacy single-device field.
              { hashedToken },
              {
                credentials: {
                  $elemMatch: {
                    hashedToken,
                    revokedAt: null,
                    expiresAt: { $gt: now },
                  },
                },
              },
            ],
          },
        ],
      })
      .select('+hashedToken +credentials +credentials.hashedToken')
      .exec();

    if (!session) {
      throw new UnauthorizedException('Invalid, revoked, or expired dining session');
    }

    return session;
  }

  async revokeCredential(sessionId: string, token: string): Promise<void> {
    const result = await this.sessionModel.updateOne(
      { _id: new Types.ObjectId(sessionId), 'credentials.hashedToken': this.hashToken(token) },
      { $set: { 'credentials.$.revokedAt': new Date() } },
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Session credential not found');
    }
  }

  async closeSession(sessionId: string, restaurantId: string) {
    const session = await this.sessionModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(sessionId),
        restaurantId: new Types.ObjectId(restaurantId),
        status: 'active',
      },
      { $set: { status: 'closed', closedAt: new Date() } },
      { new: true },
    );

    if (!session) {
      throw new NotFoundException('Active dining session not found');
    }
    // isValid always checks the parent session status, which invalidates every device credential.
    return { message: 'Dining session closed', sessionId: session._id };
  }

  private createToken(): string {
    return randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
  }
}
