/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { orderType } from './orders.controller';

@Injectable()
export class OrdersService {

    createOrder(order: orderType){
        const myOrder = {items: order.items, table: order.table}
        console.log(myOrder);
        return {
            order: crypto.randomUUID(),
            message: "Order Received"
        }
    }

}
