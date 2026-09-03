/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/order.dto';
import { OrderStatus } from './types/order.type';

@Controller('orders')
export class OrdersController {

    constructor(private readonly orderService: OrdersService){}

    @Post()
    createOrder(@Body() order: OrderDTO){
        return this.orderService.createOrder(order);
    }

    @Get('/:orderId')
    getOrderById(@Param('orderId') orderId: string){
        return this.orderService.getOrderById(orderId);
    }

    @Get('/restaurant/:restaurantId')
    getOrdersByRestaurantId(@Param('restaurantId') restaurantId: string){
        return this.orderService.getOrdersByRestaurantId(restaurantId);
    }

    @Get('/restaurant/:restaurantId/active')
    getActiveOrdersByRestaurantId(@Param('restaurantId') restaurantId: string){
        return this.orderService.getActiveOrdersByRestaurantId(restaurantId);
    }

    @Patch('/:orderId/status')
    changeOrderStatus(@Param('orderId') orderId: string, @Body('newStatus') newStatus: OrderStatus){ 
        console.log(`Changing status of order ${orderId} to ${newStatus}`);
        return this.orderService.changeOrderStatus(orderId, newStatus);
    }
}