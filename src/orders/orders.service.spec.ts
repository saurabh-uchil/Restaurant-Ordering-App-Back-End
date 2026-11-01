import { Types, type Model } from 'mongoose';
import { FoodItemsService } from '../menu/food-items/food-items.service';
import { Session } from '../session/schema/session.schema';
import { OrderDTO } from './dto/order.dto';
import { Order } from './schema/orders.schema';
import { OrderCounter } from './schema/orderCounter.schema';
import { OrdersGateway } from './gateway/orders.gateway';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  it('creates an order using the restaurant, table, and ID from the validated session', async () => {
    const sessionId = new Types.ObjectId();
    const restaurantId = new Types.ObjectId();
    const session = { _id: sessionId, restaurantId, table: 5 } as Session;
    const orderId = new Types.ObjectId();
    const item = {
      itemId: new Types.ObjectId().toString(),
      name: 'Soup',
      basePrice: 12,
      quantity: 1,
      addons: [],
      dietaryAlternatives: [],
      removableIngredients: [],
      options: {},
    };
    const orderModel = jest.fn().mockImplementation((order) => ({
      ...order,
      _id: orderId,
      save: jest.fn().mockResolvedValue({ ...order, _id: orderId }),
    }));
    const counter = { sequence: 1000, save: jest.fn().mockResolvedValue(undefined) };
    const counterModel = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(counter),
    };
    const foodItems = { getFoodItem: jest.fn().mockResolvedValue({ price: item.basePrice }) };
    const gateway = { handleOrderUpdate: jest.fn() };
    const service = new OrdersService(
      foodItems as unknown as FoodItemsService,
      orderModel as unknown as Model<Order>,
      counterModel as unknown as Model<OrderCounter>,
      gateway as unknown as OrdersGateway,
    );

    await service.createOrder({ items: [item] } as OrderDTO, session);

    expect(orderModel).toHaveBeenCalledWith(expect.objectContaining({
      restaurantId,
      table: 5,
      sessionId,
    }));
  });

  it('queries customer orders only for the validated session ID', async () => {
    const sessionId = new Types.ObjectId();
    const session = { _id: sessionId } as Session;
    const expectedOrders = [{ _id: new Types.ObjectId(), sessionId }];
    const query = {
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(expectedOrders),
    };
    const orderModel = { find: jest.fn().mockReturnValue(query) };
    const service = new OrdersService(
      {} as FoodItemsService,
      orderModel as unknown as Model<Order>,
      {} as Model<OrderCounter>,
      {} as OrdersGateway,
    );

    await expect(service.getOrdersForSession(session)).resolves.toBe(expectedOrders);
    expect(orderModel.find).toHaveBeenCalledWith({ sessionId });
  });

  it('scopes order-by-ID lookup to the validated session', async () => {
    const sessionId = new Types.ObjectId();
    const session = { _id: sessionId } as Session;
    const orderId = new Types.ObjectId();
    const expectedOrder = { _id: orderId, sessionId };
    const query = { exec: jest.fn().mockResolvedValue(expectedOrder) };
    const orderModel = { findOne: jest.fn().mockReturnValue(query) };
    const service = new OrdersService(
      {} as FoodItemsService,
      orderModel as unknown as Model<Order>,
      {} as Model<OrderCounter>,
      {} as OrdersGateway,
    );

    await expect(service.getOrderById(orderId.toString(), session)).resolves.toBe(expectedOrder);
    expect(orderModel.findOne).toHaveBeenCalledWith({ _id: orderId, sessionId });
  });
});

