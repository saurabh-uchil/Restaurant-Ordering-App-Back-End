/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
import { ActiveSessionQueryDto } from './dto/active-session-query.dto';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { CurrentUser } from '../auth/decorators/currentuser/currentuser.decorator';

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

  @Get('active')
  async hasActiveSession(@Query() query: ActiveSessionQueryDto) {
    const hasActiveSession = await this.sessionService.hasActiveSession(
      query.restaurantId,
      query.table,
    );
    return { hasActiveSession };
  }

  @Post()
  async createSession(
    @Body() body: SessionDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { session, token, cookieMaxAge } = await this.sessionService.createSession(body);
    this.setSessionCookie(response, token, cookieMaxAge);
    return this.safeSession(session);
  }

  @Post('join')
  async joinSession(
    @Body() body: SessionDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { session, token, cookieMaxAge } = await this.sessionService.joinSession(body);
    this.setSessionCookie(response, token, cookieMaxAge);
    return this.safeSession(session);
  }

  @Get('isValid')
  async validateSession(@Req() request: Request) {
    const cookieName = this.configService.getOrThrow<string>('SESSION_COOKIE_NAME');
    const token = request.cookies?.[cookieName];

    if (!token) {
      throw new UnauthorizedException('Dining session cookie is missing');
    }

    const session = await this.sessionService.isValid(token);
    return { valid: true, session: this.safeSession(session) };
  }

  @UseGuards(JwtGuard)
  @Patch(':sessionId/close')
  closeSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser('restaurant') restaurantId: string,
  ) {
    return this.sessionService.closeSession(sessionId, restaurantId);
  }

  private setSessionCookie(response: Response, token: string, maxAge: number) {
    response.cookie(this.configService.getOrThrow<string>('SESSION_COOKIE_NAME'), token, {
      httpOnly: true,
      secure: this.configService.getOrThrow<boolean>('SESSION_COOKIE_SECURE'),
      sameSite: this.configService.getOrThrow<'lax' | 'strict' | 'none'>('SESSION_COOKIE_SAME_SITE'),
      maxAge,
    });
  }

  private safeSession(session: { _id: unknown; restaurantId: unknown; table: number; status: string; expiresAt: Date | null }) {
    return {
      sessionId: session._id,
      restaurantId: session.restaurantId,
      table: session.table,
      status: session.status,
      expiresAt: session.expiresAt,
    };
  }
}
