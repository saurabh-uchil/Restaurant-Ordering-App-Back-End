/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { OrderDTO } from './dto/order.dto';
import { FoodItemsService } from '../menu/food-items/food-items.service';
import { CartItemDTO } from './dto/cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    private readonly foodItemService: FoodItemsService, 
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async checkIfPricesAreValid(cart: CartItemDTO[]): Promise<boolean> {
    for (const item of cart) {
      const menuItem = await this.foodItemService.getFoodItem(item.itemId);

      if (item.basePrice !== menuItem.price) {
        return false;
      }
    }

    return true;
  }

  async createOrder(order: OrderDTO) {
    const pricesAreValid = await this.checkIfPricesAreValid(order.cart);

    if (!pricesAreValid) {
      throw new ConflictException('Prices are updated.. Pls try again');
    }

    //save to db
   /*  const orderObject = {}
    const newOrder = await new this.orderModel().save(); */

    return {
      order: crypto.randomUUID(),
      message: 'Order Received',
    };
  }
}
