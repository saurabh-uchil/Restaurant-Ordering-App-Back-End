/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderDTO } from './dto/order.dto';
import { FoodItemsService } from '../menu/food-items/food-items.service';
import { CartItemDTO } from './dto/cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/orders.schema';
import { OrderCounter } from './schema/orderCounter.schema';
import { OrderStatus, PaymentStatus } from './types/order.type';
import { Types } from 'mongoose';
import { OrdersGateway } from './gateway/orders.gateway';
import { calculateSubtotal, calculateTotal } from './helpers/priceHelpler';

@Injectable()
export class OrdersService {
  constructor(
    private readonly foodItemService: FoodItemsService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderCounter.name)
    private orderCounterModel: Model<OrderCounter>,
    private readonly ordersGateway: OrdersGateway
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
    const pricesAreValid = await this.checkIfPricesAreValid(order.items);

    if (!pricesAreValid) {
      throw new ConflictException('Prices are updated.. Pls try again');
    }

    const subtotal = calculateSubtotal(order.items);
    const total = calculateTotal(subtotal, 5, 10);
    const paymentStatus: PaymentStatus = 'pending';
    const status: OrderStatus = 'received';
    const { items, table } = order;

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
      items,
      status,
      paymentStatus,
      total,
      subtotal,
      orderNumber,
    };

    const orderObject = await new this.orderModel(newOrder).save();
    this.ordersGateway.handleOrderUpdate(orderObject.orderNumber, orderObject.status);
    
    return {
        message: "Order Created Successfully",
        orderId: orderObject._id,
    }
  }

  async getOrderById(orderId: string){
    const data = await this.orderModel.findById(new Types.ObjectId(orderId));
    return data;
  }

  async getOrdersByRestaurantId(restaurantId: string){
    const data = await this.orderModel.find({restaurantId: new Types.ObjectId(restaurantId)});
    return data;
  }

  async getActiveOrdersByRestaurantId(restaurantId: string){
    const data = await this.orderModel.find({restaurantId: new Types.ObjectId(restaurantId), status: { $in: ["received", "preparing", "ready"] }});
    return data;
  }

  async changeOrderStatus(orderId: string, newStatus: OrderStatus){
    const order = await this.orderModel.findById(new Types.ObjectId(orderId));
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = newStatus;
    await order.save();
    //this.ordersGateway.handleOrderUpdate(order.orderNumber, newStatus);
    return {
        message: "Order Status Updated Successfully",
        orderId: order._id,
        newStatus: order.status
      }
  }
}