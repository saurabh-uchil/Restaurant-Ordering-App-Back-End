/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schema/session.schema';
import { SessionDeviceSchema } from './schema/session-device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Session', schema: SessionSchema },
      { name: 'SessionDevice', schema: SessionDeviceSchema },
    ]),
  ],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
