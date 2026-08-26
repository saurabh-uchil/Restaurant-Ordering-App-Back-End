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
import { OrderCounter } from './schema/orderCounter.schema';
import { OrderStatus, PaymentStatus } from './types/order.type';
import { Types } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    private readonly foodItemService: FoodItemsService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderCounter.name)
    private orderCounterModel: Model<OrderCounter>,
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

  calculateSubtotal = (cartItems: CartItemDTO[]) => {
    let sum = 0;
    for (const cart of cartItems) {
      const addonsTotal =
        cart?.addons &&
        cart?.addons.reduce((sum, addon) => sum + addon.extraCost, 0);
      const dietaryAlternativesTotal =
        cart?.dietaryAlternatives &&
        cart?.dietaryAlternatives.reduce((sum, da) => sum + da.extraCost, 0);
      const optionsTotal =
        cart?.options &&
        Object.values(cart?.options).reduce(
          (sum, option) => sum + option.extraCost,
          0,
        );
      sum +=
        addonsTotal + dietaryAlternativesTotal + optionsTotal + cart.basePrice;
    }

    return sum;
  };

  calculateTotal = (subtotal: number, serviceCharge: number, tax: number) => {
    return (subtotal * serviceCharge) / 100 + (subtotal * tax) / 100 + subtotal;
  };

  async createOrder(order: OrderDTO) {
    const pricesAreValid = await this.checkIfPricesAreValid(order.cart);

    if (!pricesAreValid) {
      throw new ConflictException('Prices are updated.. Pls try again');
    }

    const subtotal = this.calculateSubtotal(order.cart);
    const total = this.calculateTotal(subtotal, 5, 10);
    const paymentStatus: PaymentStatus = 'pending';
    const status: OrderStatus = 'received';
    const { cart, table } = order;

    const restaurantId = new Types.ObjectId(order.restaurantId)

    let counter = await this.orderCounterModel.findOne({
      restaurantId,
    });

    if (!counter) {
      counter = await this.orderCounterModel.create({
        restaurantId,
        sequence: 1000,
      });
    }

    counter.sequence += 1;
    await counter.save();

    const orderNumber = counter.sequence;

    const newOrder = {
      restaurantId,
      table,
      cart,
      status,
      paymentStatus,
      total,
      subtotal,
      orderNumber,
    };

    const orderObject = await new this.orderModel(newOrder).save();

    /* return {
      message: "Order Created Successfully",
      order:{
        orderId: orderObject._id, 
        orderNumber: orderObject.orderNumber, 
        total: orderObject.total, 
        subtotal: orderObject.subtotal, 
        status: orderObject.status, 
        paymentStatus: orderObject.paymentStatus, 
        table: orderObject.table, 
        items: orderObject.cart,
      }
    }; */
    return {
        message: "Order Created Successfully",
        orderId: orderObject._id,
    }
  }

  async getOrderById(orderId: string){
    const data = await this.orderModel.findById(new Types.ObjectId(orderId));
    return data;
  }
}
