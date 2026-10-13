import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from '../films/schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  findAll() {
    return this.filmModel
      .find()
      .select({
        _id: 0,
        __v: 0,
        schedule: 0,
      })
      .lean()
      .exec();
  }

  findById(id: string) {
    return this.filmModel.findOne({ id }).exec();
  }

  findScheduleByFilmId(id: string) {
    return this.filmModel
      .findOne({ id })
      .select({ schedule: 1, _id: 0 })
      .lean()
      .exec();
  }

  save(film: FilmDocument) {
    return film.save();
  }
}
