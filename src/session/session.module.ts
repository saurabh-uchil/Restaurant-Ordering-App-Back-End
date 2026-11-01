/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schema/session.schema';
import { SessionGuard } from './guards/session/session.guard';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
  providers: [SessionService, SessionGuard, JwtGuard],
  controllers: [SessionController],
  exports: [SessionGuard],
})
export class SessionModule {}
