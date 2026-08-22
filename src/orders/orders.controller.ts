/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

export type orderType = {
    items: any,
    table: string
}

@Controller('orders')
export class OrdersController {

    constructor(private readonly orderService: OrdersService){}

    @Post()
    createOrder(@Body() order: orderType){
        return this.orderService.createOrder(order);
    }
}
