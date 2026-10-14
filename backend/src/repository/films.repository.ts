import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  findAll() {
    return this.filmRepository.find({
      select: {
        id: true,
        rating: true,
        director: true,
        tags: true,
        image: true,
        cover: true,
        title: true,
        about: true,
        description: true,
      },
    });
  }

  findById(id: string) {
    return this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
  }

  findScheduleByFilmId(id: string) {
    return this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
      select: {
        id: true,
        schedule: {
          id: true,
          daytime: true,
          hall: true,
          rows: true,
          seats: true,
          price: true,
          taken: true,
        },
      },
    });
  }

  async save(film: Film) {
    await this.scheduleRepository.save(film.schedule);
    return film;
  }

  saveSchedule(schedule: Schedule) {
    return this.scheduleRepository.save(schedule);
  }
}
