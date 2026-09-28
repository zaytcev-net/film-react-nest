import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll() {
    const films = await this.filmsRepository.findAll();

    return {
      items: films,
      total: films.length,
    };
  }

  async findFilmWithSchedule(id: string) {
    const film = await this.filmsRepository.findScheduleByFilmId(id);

    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    const schedule = film?.schedule ?? [];

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
