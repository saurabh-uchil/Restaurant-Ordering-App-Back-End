/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';

@Controller('session')
export class SessionController {

    @Get()
    getSession() {
        return { message: 'Session endpoint' };
    }
}
