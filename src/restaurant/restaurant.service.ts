/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FoodItem } from '../menu/food-items/schema/FoodItem.schema';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantService {
    constructor( 
        @InjectModel(FoodItem.name) 
        private foodItemModel: Model<FoodItem>
    ){}

    async getMenu(restaurant_Id: string){
        const menu = await this.foodItemModel.find({restaurant_Id});
        return menu;
    }
}
