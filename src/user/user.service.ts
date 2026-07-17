/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Restaurant } from '../restaurant/schema/restaurant.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor( @InjectModel(User.name) private userModel: Model<User>, 
        @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant> ){}

     async getUsers(){
        const users = await this.userModel.find().populate('restaurant').exec();
        return users;
     }   
}
