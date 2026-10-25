/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
import { SessionService } from './session.service';
import { Response } from 'express';

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
    const {session, token } = await this.sessionService.createSession(body); 
    const {_id, restaurantId, table, status} = session;
    response.cookie('dining_session', token, {httpOnly: true});
    return {sessionId: _id, restaurantId, table, status};
  }
}
