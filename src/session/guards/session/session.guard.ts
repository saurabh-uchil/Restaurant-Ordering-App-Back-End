import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionService } from '../../session.service';
import type { Session } from '../../schema/session.schema';

export type SessionRequest = Request & {
  diningSession?: Session;
};

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();
    const token = request.cookies?.dining_session;

    if (!token) {
      throw new UnauthorizedException('Dining session cookie is missing');
    }

    request.diningSession = await this.sessionService.isValid(token);
    return true;
  }
}
