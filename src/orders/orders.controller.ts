/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/order.dto';

@Controller('orders')
export class OrdersController {

    constructor(private readonly orderService: OrdersService){}

    @Post()
    createOrder(@Body() order: OrderDTO){
        return this.orderService.createOrder(order);
    }
}
