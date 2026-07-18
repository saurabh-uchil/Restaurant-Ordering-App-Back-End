/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDTO } from './dto/login.dto';
import { JwtGuard } from './guards/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('register')
    register(@Body() body: RegisterUserDto) {
        //console.log(body);
        return this.authService.register(body);
    }

    @Post('login')
    login(@Body() body: LoginUserDTO){
        return this.authService.login(body);
    }

    @UseGuards(JwtGuard)
    @Get('sample')
    sample(@Body() body:{name:string, department:string}){
        return body;
    }
}
