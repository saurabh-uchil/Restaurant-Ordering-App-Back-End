/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Restaurant, RestaurantSchema } from '../restaurant/schema/restaurant.schema';

@Module({
   imports: [MongooseModule.forFeature([
    {name:User.name, schema:UserSchema},
    {name:Restaurant.name, schema:RestaurantSchema}
  ])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
