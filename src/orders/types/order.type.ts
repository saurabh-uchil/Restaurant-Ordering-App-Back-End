/* eslint-disable prettier/prettier */
type SelectedItem = {
  name: string;
  extraCost: number;
};

export type CartItem = {
  name: string;
  itemId: string;
  cartItemId: string;
  imageUrl: string;
  basePrice: number;
  extraCost?: number;
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