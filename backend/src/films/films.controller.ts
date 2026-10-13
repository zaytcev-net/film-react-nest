import { Controller, Get, Param } from '@nestjs/common';

import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findFilmWithSchedule(@Param('id') id: string) {
    return this.filmsService.findFilmWithSchedule(id);
  }
}
