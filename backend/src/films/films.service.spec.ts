import { Test, TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { NotFoundException } from '@nestjs/common';

import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';

jest.mock('../repository/films.repository', () => ({
  FilmsRepository: class FilmsRepository {},
}));

describe('FilmsService', () => {
  let service: FilmsService;

  const mockFilmsRepository = {
    findAll: jest.fn<() => Promise<unknown>>(),
    findScheduleByFilmId: jest.fn<(id: string) => Promise<unknown>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('должен возвращать список фильмов и их количество', async () => {
      const films = [
        { id: 'film-1', title: 'Фильм 1' },
        { id: 'film-2', title: 'Фильм 2' },
      ];

      mockFilmsRepository.findAll.mockResolvedValue(films);

      const result = await service.findAll();

      expect(mockFilmsRepository.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        items: films,
        total: 2,
      });
    });
  });

  describe('findFilmWithSchedule', () => {
    it('должен возвращать расписание фильма', async () => {
      const film = {
        id: 'film-123',
        schedule: [
          { id: 'session-1', daytime: '2026-11-08T12:00:00' },
          { id: 'session-2', daytime: '2026-11-08T18:00:00' },
        ],
      };

      mockFilmsRepository.findScheduleByFilmId.mockResolvedValue(film);

      const result = await service.findFilmWithSchedule('film-123');

      expect(mockFilmsRepository.findScheduleByFilmId).toHaveBeenCalledWith(
        'film-123',
      );

      expect(result).toEqual({
        items: film.schedule,
        total: 2,
      });
    });

    it('должен выбрасывать NotFoundException, если фильм не найден', async () => {
      mockFilmsRepository.findScheduleByFilmId.mockResolvedValue(null);

      await expect(
        service.findFilmWithSchedule('unknown-film'),
      ).rejects.toThrow(NotFoundException);

      expect(mockFilmsRepository.findScheduleByFilmId).toHaveBeenCalledWith(
        'unknown-film',
      );
    });

    it('должен возвращать пустое расписание, если у фильма его нет', async () => {
      const film = {
        id: 'film-123',
        schedule: null,
      };

      mockFilmsRepository.findScheduleByFilmId.mockResolvedValue(film);

      const result = await service.findFilmWithSchedule('film-123');

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });
  });
});
