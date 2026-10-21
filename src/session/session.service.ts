/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schema/session.schema';
import { Model } from 'mongoose';
import { SessionDto } from './dto/session.dto';

@Injectable()
export class SessionService {

    constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}
  
    createHttpOnlyCookies(){
        console.log("Here we need to add the implementation");
    }

    createSession(sessionData: SessionDto){
        //implemetation to create a session in the database
    }
}
