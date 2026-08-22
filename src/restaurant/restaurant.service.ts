/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FoodItem } from '../menu/food-items/schema/FoodItem.schema';
import { Model } from 'mongoose';
import { Restaurant } from './schema/restaurant.schema';
import { Types } from "mongoose";

@Injectable()
export class RestaurantService {
    constructor( 
        @InjectModel(FoodItem.name) 
        private foodItemModel: Model<FoodItem>,

        @InjectModel(Restaurant.name)
        private restaurantModel: Model<Restaurant>
    ){}

    async getMenu(restaurant_Id: string){
        const restaurantObjectId = new Types.ObjectId(restaurant_Id);
        const menu = await this.foodItemModel.find({restaurant_Id:restaurantObjectId}) 
                .populate('addons')
                .populate('dietaryAlternatives')
                .populate({ path: 'options', populate: { path: 'choices' } });
        return menu;
    }

    async getRestaurant(restaurant_Id:string){
        const restaurant = await this.restaurantModel.findById({_id:restaurant_Id});
        return restaurant;
    }

    async getRestaurantBySlug(slug: string){
        const restaurant = await this.restaurantModel.findOne({slug});
        if(!restaurant){
            throw new NotFoundException(`Restaurant Not Found`);
        }
        return restaurant;
    }

    async getMenuBySlug(slug: string){
        const restaurant = await this.getRestaurantBySlug(slug);
        const restaurantId = restaurant._id.toString();
       
        const menu = await this.getMenu(restaurantId)

        return menu;
    }
}