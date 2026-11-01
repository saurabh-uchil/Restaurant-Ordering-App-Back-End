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
    UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../session/guards/session/session.guard';
import type { SessionRequest } from '../session/guards/session/session.guard';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/order.dto';
import { OrderStatus } from './types/order.type';

@Controller('orders')
export class OrdersController {

    constructor(private readonly orderService: OrdersService){}

    @UseGuards(SessionGuard)
    @Post()
    createOrder(@Body() order: OrderDTO, @Req() request: SessionRequest){
        return this.orderService.createOrder(order, request.diningSession!);
    }

    @UseGuards(SessionGuard)
    @Get('/session/current')
    getOrdersForCurrentSession(@Req() request: SessionRequest) {
        return this.orderService.getOrdersForSession(request.diningSession!);
    }

    @UseGuards(SessionGuard)
    @Get('/:orderId')
    getOrderById(@Param('orderId') orderId: string, @Req() request: SessionRequest){
        return this.orderService.getOrderById(orderId, request.diningSession!);
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
        return this.orderService.changeOrderStatus(orderId, newStatus);
    }

    @Get('/restaurant/:restaurantId/completed')
    getCompletedOrdersByRestaurantId(@Param('restaurantId') restaurantId: string){
        return this.orderService.getCompletedOrdersByRestaurantId(restaurantId);
    }
}

