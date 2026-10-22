/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {

    constructor(private readonly sessionService: SessionService) {}

    @Get()
    getSession() {
        return this.sessionService.getSession();
    }

    @Post()
    createSession(@Body() body: SessionDto) {
        return this.sessionService.createSession(body);
    }
}
