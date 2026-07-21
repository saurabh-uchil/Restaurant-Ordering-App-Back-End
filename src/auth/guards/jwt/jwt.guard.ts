/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest, JWTPayload } from '../../types/authRequestTypes';


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    if(!request.headers.authorization){
      throw new UnauthorizedException("Missing Access Token");
    }

    const [bearer, token] = request.headers.authorization.split(' ');

    if(!bearer || bearer != "Bearer" || !token){
      throw new UnauthorizedException("Invalid Authorizaion Header");
    }

    try{
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token);
      request.payload = payload;
      return true;
    }catch(error){
      throw new UnauthorizedException('Invalid or expired token');
    }

  }
}
