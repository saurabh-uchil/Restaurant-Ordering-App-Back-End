/* eslint-disable prettier/prettier */

import { FoodItemsService } from './food-items/food-items.service';
import { Injectable } from '@nestjs/common';
import { FoodItem } from './food-items/schema/FoodItem.schema';


@Injectable()
export class MenuService {

    constructor(private readonly foodItemsService: FoodItemsService){}
   
    getMenuItems(): Promise<FoodItem[]> {
        return this.foodItemsService.getMenuItems();
    }

}
