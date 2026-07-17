/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import {Restaurant, RestaurantSchema} from '../restaurant/schema/restaurant.schema'

@Module({
  imports: [MongooseModule.forFeature([
    {name:User.name, schema:UserSchema},
    {name:Restaurant.name, schema:RestaurantSchema}
  ])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
