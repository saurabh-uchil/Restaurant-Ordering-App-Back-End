/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItemDto } from './dto/FoodItem.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';
import { CurrentUser } from '../../auth/decorators/currentuser/currentuser.decorator';

@Controller('food-items')
export class FoodItemsController {

    constructor(private readonly foodItemsService: FoodItemsService){}

    @UseGuards(JwtGuard)
    @Post('create-food-item-for-a-restaurant')
    createFoodItemByRestaurant(@Body() foodItem: FoodItemDto, @CurrentUser('restaurant') restaurantId: string){
        return this.foodItemsService.addFoodItemToARestaurant(foodItem, restaurantId);
    }
}
