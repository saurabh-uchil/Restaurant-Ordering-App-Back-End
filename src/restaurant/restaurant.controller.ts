/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { FoodItem } from '../menu/food-items/schema/FoodItem.schema';

@Controller('restaurant')
export class RestaurantController {
    
    constructor(private readonly restaurantService: RestaurantService){}

    @Get('/:restaurantId/menu')
    getMenu(@Param('restaurantId') restaurantId:string):Promise<FoodItem[]>{
        const data = this.restaurantService.getMenu(restaurantId);
        return data;
    }
}
