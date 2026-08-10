/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { FoodItem } from '../menu/food-items/schema/FoodItem.schema';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';

@Controller('restaurant')
export class RestaurantController {
    
    constructor(private readonly restaurantService: RestaurantService){}

    @Get('/:restaurantId/menu')
    getMenu(@Param('restaurantId') restaurantId:string):Promise<FoodItem[]>{
        const data = this.restaurantService.getMenu(restaurantId);
        return data;
    }

    @UseGuards(JwtGuard)
    @Get('/:restaurantId')
    async getRestaurant(@Param('restaurantId') restaurantId: string){
        const data = await this.restaurantService.getRestaurant(restaurantId);
        return data;
    }

    @Get('/slug/:slug')
    async getRestauranBySlug(@Param('slug') slug:string){
        const data = await this.restaurantService.getRestaurantBySlug(slug);
        return data;
    }

}
