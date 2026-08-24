/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CartItem, OrderStatus, PaymentStatus } from "../types/order.type";

@Schema({timestamps: true})
export class Order extends Document{
    
    @Prop({required: true})
    table!: number;

    @Prop({required: true})
    restaurantId!: string;

    @Prop({required: true})
    status!: OrderStatus;

    @Prop({required: true})
    paymentStatus! : PaymentStatus;

    @Prop({required: true})
    orderNumber!: number;

    @Prop({required: true})
    cart!: CartItem[];

    @Prop({required: true})
    subtotal!: number;

    @Prop({required: true})
    total!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);