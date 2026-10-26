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

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

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
    console.log(token);
    const { _id, restaurantId, table, status } = session;
    response.cookie('dining_session', token, { httpOnly: true });
    return { sessionId: _id, restaurantId, table, status };
  }

  @Get('isValid')
  async validateSession(@Req() request: Request) {
    const token = request.cookies?.dining_session;

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
