/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { FoodItem, FoodItemSchema } from '../menu/food-items/schema/FoodItem.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([
    { name: FoodItem.name, schema: FoodItemSchema }])], 
  providers: [RestaurantService],
  controllers: [RestaurantController]
})
export class RestaurantModule {}
