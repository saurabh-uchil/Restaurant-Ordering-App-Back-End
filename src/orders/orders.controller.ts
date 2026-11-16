/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/order.dto';
import { OrderStatus } from './types/order.type';
import { SessionGuard } from '../session/guards/session/session.guard';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
  ) {}

  @Post()
  @UseGuards(SessionGuard)
  createOrder(@Req() req: Request, @Body() order: OrderDTO) {
    const diningSession = req.diningSession;

    if (!diningSession) {
      throw new UnauthorizedException('Dining session not found');
    }

    const orderData = {
      sessionId: diningSession._id,
      restaurantId: diningSession.restaurantId,
      table: diningSession.table,
      items: order.items,
    };

    return this.orderService.createOrder(orderData);
  }

  @Get('/:orderId')
  getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Get('/restaurant/:restaurantId')
  getOrdersByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.orderService.getOrdersByRestaurantId(restaurantId);
  }

  @Get('/restaurant/:restaurantId/active')
  getActiveOrdersByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.orderService.getActiveOrdersByRestaurantId(restaurantId);
  }

  @Patch('/:orderId/status')
  changeOrderStatus(
    @Param('orderId') orderId: string,
    @Body('newStatus') newStatus: OrderStatus,
  ) {
    return this.orderService.changeOrderStatus(orderId, newStatus);
  }

  @Get('/restaurant/:restaurantId/completed')
  getCompletedOrdersByRestaurantId(
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.orderService.getCompletedOrdersByRestaurantId(restaurantId);
  }

  @Get('/session/current')
@UseGuards(SessionGuard)
getOrdersByDiningSession(@Req() req: Request) {
  const diningSession = req.diningSession;

  if (!diningSession) {
    throw new UnauthorizedException('Dining session not found');
  }

  return this.orderService.getOrdersBySessionId(
    diningSession._id.toString(),
  );
}
}
