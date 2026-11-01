/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('session')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getSession() {
    return this.sessionService.getSession();
  }

  @Post()
  async createSession(
    @Body() body: SessionDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { session, token } = await this.sessionService.createSession(body);
    const { _id, restaurantId, table, status } = session;
    response.cookie(this.configService.getOrThrow<string>('SESSION_COOKIE_NAME'), token, {
      httpOnly: true,
      secure: this.configService.getOrThrow<boolean>('SESSION_COOKIE_SECURE'),
      sameSite: this.configService.getOrThrow<'lax' | 'strict' | 'none'>('SESSION_COOKIE_SAME_SITE'),
      maxAge: this.configService.getOrThrow<number>('SESSION_COOKIE_MAX_AGE'),
    });
    return { sessionId: _id, restaurantId, table, status };
  }

  @Get('isValid')
  async validateSession(@Req() request: Request) {
    const cookieName = this.configService.getOrThrow<string>('SESSION_COOKIE_NAME');
    const token = request.cookies?.[cookieName];

    if (!token) {
      throw new UnauthorizedException('Dining session cookie is missing');
    }

    const session = await this.sessionService.isValid(token);

    return {
      valid: true,
      session: {
        sessionId: session._id,
        restaurantId: session.restaurantId,
        table: session.table,
        status: session.status,
        expiresAt: session.expiresAt,
      },
    };
  }
}
