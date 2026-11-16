/* eslint-disable prettier/prettier */
import { OrderDTO } from "../dto/order.dto";
import {  Types } from 'mongoose';

type SelectedItem = {
  name: string;
  extraCost: number;
};

export type CartItem = {
  name: string;
  basePrice: number;
  itemId: string;
  cartItemId: string;
  specialInstructions?: string;
  quantity: number;
  addons: SelectedItem[];
  dietaryAlternatives: SelectedItem[];
  removableIngredients: string[];
  options: Record<string, SelectedItem>;
};

export type OrderStatus =
    "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentStatus = 
    "pending"
  | "paid"
  |"failed"
  |"refunded"

export type CreateOrderInput = OrderDTO & {
  sessionId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  table: number;
};