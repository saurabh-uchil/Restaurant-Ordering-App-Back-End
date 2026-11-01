import { Types } from 'mongoose';
import { Session } from '../session/schema/session.schema';
import type { SessionRequest } from '../session/guards/session/session.guard';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  it('passes the SessionGuard-validated session to customer order lookup', async () => {
    const orderId = new Types.ObjectId().toString();
    const diningSession = { _id: new Types.ObjectId() } as Session;
    const order = { _id: orderId, sessionId: diningSession._id };
    const ordersService = { getOrderById: jest.fn().mockResolvedValue(order) };
    const controller = new OrdersController(ordersService as unknown as OrdersService);

    await expect(
      controller.getOrderById(orderId, { diningSession } as SessionRequest),
    ).resolves.toBe(order);
    expect(ordersService.getOrderById).toHaveBeenCalledWith(orderId, diningSession);
  });
});

