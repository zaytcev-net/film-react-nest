import { Test, TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';

jest.mock('../repository/films.repository', () => ({
  FilmsRepository: class FilmsRepository {},
}));

describe('OrderService', () => {
  let service: OrderService;

  const mockFilmsRepository = {
    findById: jest.fn<(id: string) => Promise<unknown>>(),
    save: jest.fn<(film: unknown) => Promise<unknown>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsRepository,
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Создаём тестовый заказ
  const createOrder = (): CreateOrderDto => ({
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
  });

  // Создаём тестовый фильм с расписанием
  const createFilm = () => ({
    id: 'film-123',
    schedule: [
      {
        id: 'session-123',
        daytime: '2026-11-08T18:00:00',
        rows: 10,
        seats: 20,
        price: 500,
        taken: [],
      },
    ],
  });

  describe('create', () => {
    it('должен выбрасывать BadRequestException, если заказ пустой', async () => {
      const order = createOrder();
      order.tickets = [];

      await expect(service.create(order)).rejects.toThrow(BadRequestException);

      expect(mockFilmsRepository.findById).not.toHaveBeenCalled();
    });

    it('должен выбрасывать NotFoundException, если фильм не найден', async () => {
      const order = createOrder();

      mockFilmsRepository.findById.mockResolvedValue(null);

      await expect(service.create(order)).rejects.toThrow(NotFoundException);

      expect(mockFilmsRepository.findById).toHaveBeenCalledWith('film-123');
    });

    it('должен запрещать билеты на разные фильмы', async () => {
      const order = createOrder();

      order.tickets.push({
        ...order.tickets[0],
        film: 'film-456',
      });

      mockFilmsRepository.findById.mockResolvedValue(createFilm());

      await expect(service.create(order)).rejects.toThrow(BadRequestException);
    });

    it('должен выбрасывать NotFoundException, если сеанс не найден', async () => {
      const order = createOrder();
      order.tickets[0].session = 'unknown-session';

      mockFilmsRepository.findById.mockResolvedValue(createFilm());

      await expect(service.create(order)).rejects.toThrow(NotFoundException);
    });

    it('должен выбрасывать BadRequestException при некорректном месте', async () => {
      const order = createOrder();
      order.tickets[0].row = 0;

      mockFilmsRepository.findById.mockResolvedValue(createFilm());

      await expect(service.create(order)).rejects.toThrow(BadRequestException);
    });

    it('должен выбрасывать BadRequestException, если место уже занято', async () => {
      const order = createOrder();
      const film = createFilm();

      film.schedule[0].taken = ['2:3'];

      mockFilmsRepository.findById.mockResolvedValue(film);

      await expect(service.create(order)).rejects.toThrow(BadRequestException);
    });

    it('должен создавать заказ и сохранять занятое место', async () => {
      const order = createOrder();
      const film = createFilm();

      mockFilmsRepository.findById.mockResolvedValue(film);
      mockFilmsRepository.save.mockResolvedValue(film);

      const result = await service.create(order);

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);

      expect(result.items[0]).toEqual({
        id: expect.any(String),
        film: 'film-123',
        session: 'session-123',
        daytime: '2026-11-08T18:00:00',
        row: 2,
        seat: 3,
        price: 500,
      });

      expect(film.schedule[0].taken).toContain('2:3');

      expect(mockFilmsRepository.save).toHaveBeenCalledWith(film);
    });
  });
});
