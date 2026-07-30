/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FoodItem } from '../menu/food-items/schema/FoodItem.schema';
import { Model } from 'mongoose';
import { Restaurant } from './schema/restaurant.schema';

@Injectable()
export class RestaurantService {
    constructor( 
        @InjectModel(FoodItem.name) 
        private foodItemModel: Model<FoodItem>,

        @InjectModel(Restaurant.name)
        private restaurantModel: Model<Restaurant>
    ){}

    async getMenu(restaurant_Id: string){
        const menu = await this.foodItemModel.find({restaurant_Id}).populate('dietaryAlternatives').exec();
        return menu;
    }

    async getRestaurant(restaurant_Id:string){
        console.log("request made");
        console.log(restaurant_Id);
        const restaurant = await this.restaurantModel.findById({_id:restaurant_Id});
        return restaurant;
    }
}
