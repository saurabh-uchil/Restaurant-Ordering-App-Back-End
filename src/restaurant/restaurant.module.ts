/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { FoodItem, FoodItemSchema } from '../menu/food-items/schema/FoodItem.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './schema/restaurant.schema';
import { Order, OrderSchema } from '../orders/schema/orders.schema';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name: FoodItem.name, schema: FoodItemSchema },
    {name: Restaurant.name, schema:RestaurantSchema},
    {name: Order.name, schema: OrderSchema}
  ]), OrdersModule], 
  providers: [RestaurantService],
  controllers: [RestaurantController]
})
export class RestaurantModule {}
