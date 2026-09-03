/* eslint-disable prettier/prettier */
import { CartItemDTO } from '../dto/cart.dto';

export const calculateSubtotal = (cartItems: CartItemDTO[]) => {
  let sum = 0;
  
  for (const cart of cartItems) {
    
    const addonsTotal = cart?.addons && cart?.addons.reduce((sum, addon) => sum + addon.extraCost, 0);

    const dietaryAlternativesTotal = cart?.dietaryAlternatives && cart?.dietaryAlternatives.reduce((sum, da) => sum + da.extraCost, 0);

    const optionsTotal = cart?.options && Object.values(cart?.options).reduce((sum, option) => sum + option.extraCost,0);
      
    sum +=addonsTotal + dietaryAlternativesTotal + optionsTotal + cart.basePrice;

  }

  return sum;
};

export const calculateTotal = (subtotal: number, serviceCharge: number, tax: number) => {
  return (subtotal * serviceCharge) / 100 + (subtotal * tax) / 100 + subtotal;
};
