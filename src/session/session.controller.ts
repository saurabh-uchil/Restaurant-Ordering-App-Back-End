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
  createSession(
    @Body() body: SessionDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('dining_session', 'example-token', {
      httpOnly: true,
    });
    return this.sessionService.createSession(body);
  }
}
