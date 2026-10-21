/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SessionDto } from './dto/session.dto';

@Controller('session')
export class SessionController {

    @Get()
    getSession() {
        return { message: 'Session endpoint' };
    }

    @Post()
    createSession(@Body() body: SessionDto) {
        console.log('Received session data:', body);
        return { message: 'Create session endpoint' };
    }
}
