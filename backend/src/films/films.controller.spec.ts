import { Test, TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

jest.mock('./films.service', () => ({
  FilmsService: class FilmsService {},
}));

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    findAll: jest.fn<() => Promise<unknown>>(),
    findFilmWithSchedule: jest.fn<(id: string) => Promise<unknown>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('должен вызывать метод findAll сервиса', async () => {
      const films = [
        { id: '1', title: 'Фильм 1' },
        { id: '2', title: 'Фильм 2' },
      ];

      mockFilmsService.findAll.mockResolvedValue({
        items: films,
        total: films.length,
      });

      const result = await controller.findAll();

      expect(mockFilmsService.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        items: films,
        total: 2,
      });
    });
  });

  describe('findFilmWithSchedule', () => {
    it('должен передавать id фильма в сервис', async () => {
      const filmId = 'film-123';

      const schedule = [{ id: 'session-1', daytime: '2026-11-08T12:00:00' }];

      mockFilmsService.findFilmWithSchedule.mockResolvedValue({
        items: schedule,
        total: schedule.length,
      });

      const result = await controller.findFilmWithSchedule(filmId);

      expect(mockFilmsService.findFilmWithSchedule).toHaveBeenCalledWith(
        filmId,
      );

      expect(result).toEqual({
        items: schedule,
        total: 1,
      });
    });
  });
});
