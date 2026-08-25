/* eslint-disable prettier/prettier */
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