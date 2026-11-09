/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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

  @Get('active')
  async getActive(
    @Query('restaurantId') restaurantId: string,
    @Query('table') table: string,
  ) {
    const activeSession = await this.sessionService.findActiveSession(
      restaurantId,
      Number(table),
    );

    //need to validate and join session here

    if (!activeSession) {
      return {
        hasActiveSession: false,
        session: null,
      };
    }

    return {
      hasActiveSession: true,
      session: {
        sessionId: activeSession._id,
        restaurantId: activeSession.restaurantId,
        table: activeSession.table,
        status: activeSession.status,
      },
    };
  }
}
