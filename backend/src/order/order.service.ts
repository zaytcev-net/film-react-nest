import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(order: CreateOrderDto) {
    if (order.tickets.length === 0) {
      throw new BadRequestException('Заказ не содержит билетов');
    }

    const filmId = order.tickets[0].film;

    const film = await this.filmsRepository.findById(filmId);

    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    const items = [];

    for (const ticket of order.tickets) {
      if (ticket.film !== filmId) {
        throw new BadRequestException(
          'Все билеты заказа должны относиться к одному фильму',
        );
      }

      const session = film.schedule.find((item) => item.id === ticket.session);

      if (!session) {
        throw new NotFoundException('Сеанс не найден');
      }

      if (
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException('Некорректное место');
      }

      const seat = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(seat)) {
        throw new BadRequestException(`Место ${seat} уже занято`);
      }

      session.taken.push(seat);

      items.push({
        id: randomUUID(),
        film: ticket.film,
        session: ticket.session,
        daytime: session.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: session.price,
      });
    }

    await this.filmsRepository.save(film);

    const total = items.reduce((sum, ticket) => sum + ticket.price, 0);

    return {
      total,
      items,
    };
  }
}
