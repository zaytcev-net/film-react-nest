import { Test, TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

jest.mock('./order.service', () => ({
  OrderService: class OrderService {},
}));

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    create: jest.fn<(order: CreateOrderDto) => Promise<unknown>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('должен передавать заказ в сервис', async () => {
      const order: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            film: 'film-123',
            session: 'session-123',
            daytime: '2026-11-08T18:00:00',
            row: 2,
            seat: 3,
            price: 500,
          },
        ],
      };

      const expectedResult = {
        total: 1,
        items: [
          {
            id: 'ticket-123',
            film: 'film-123',
            session: 'session-123',
            row: 2,
            seat: 3,
            price: 500,
          },
        ],
      };

      mockOrderService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(order);

      expect(mockOrderService.create).toHaveBeenCalledTimes(1);
      expect(mockOrderService.create).toHaveBeenCalledWith(order);
      expect(result).toEqual(expectedResult);
    });
  });
});
