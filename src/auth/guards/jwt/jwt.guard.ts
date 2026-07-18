/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if(!request.headers.authorization){
      throw new UnauthorizedException("Missing Access Token");
    }

    const [bearer, token] = request.headers.authorization.split(' ');

    if(!bearer || bearer != "Bearer" || !token){
      throw new UnauthorizedException("Invalid Authorizaion Header");
    }

    try{
      await this.jwtService.verifyAsync(token);
      return true;
    }catch(error){
      throw new UnauthorizedException('Invalid or expired token');
    }

  }
}
