/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { FoodItemsModule } from '../menu/food-items/food-items.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/orders.schema';
import { OrderCounter, OrderCounterSchema } from './schema/orderCounter.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name:Order.name, schema: OrderSchema},
    {name:OrderCounter.name, schema: OrderCounterSchema}
  ]), 
    FoodItemsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
