/* eslint-disable prettier/prettier */

import { FoodItemsService } from './food-items/food-items.service';
import { Injectable } from '@nestjs/common';
import { FoodItem } from './food-items/schema/FoodItem.schema';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class MenuService {

    constructor( 
        @InjectModel(FoodItem.name) 
        private foodItemModel: Model<FoodItem>,
        
        private readonly foodItemsService: FoodItemsService){}
   
    getMenuItems(): Promise<FoodItem[]> {
        return this.foodItemsService.getMenuItems();
    }
}
