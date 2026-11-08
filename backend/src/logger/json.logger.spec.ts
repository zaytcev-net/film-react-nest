import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('должен формировать корректное JSON-сообщение', () => {
      const logger = new JsonLogger();

      const result = logger.formatMessage('log', 'Тестовое сообщение');

      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        level: 'log',
        message: 'Тестовое сообщение',
        optionalParams: [],
        timestamp: expect.any(String),
      });
    });

    it('должен сохранять дополнительные параметры', () => {
      const logger = new JsonLogger();

      const result = logger.formatMessage(
        'error',
        'Ошибка',
        'Дополнительная информация',
        404,
      );

      const parsed = JSON.parse(result);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('Ошибка');
      expect(parsed.optionalParams).toEqual(['Дополнительная информация', 404]);
    });
  });

  describe('log', () => {
    it('должен выводить сообщение через console.log', () => {
      const logger = new JsonLogger();
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      logger.log('Обычное сообщение');

      expect(consoleSpy).toHaveBeenCalledTimes(1);

      const output = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('Обычное сообщение');
    });
  });

  describe('error', () => {
    it('должен выводить сообщение через console.error', () => {
      const logger = new JsonLogger();
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      logger.error('Произошла ошибка');

      expect(consoleSpy).toHaveBeenCalledTimes(1);

      const output = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('Произошла ошибка');
    });
  });

  describe('warn', () => {
    it('должен выводить сообщение через console.warn', () => {
      const logger = new JsonLogger();
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      logger.warn('Предупреждение');

      expect(consoleSpy).toHaveBeenCalledTimes(1);

      const output = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('Предупреждение');
    });
  });

  describe('debug', () => {
    it('должен выводить сообщение через console.debug', () => {
      const logger = new JsonLogger();
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => {});

      logger.debug('Отладочное сообщение');

      expect(consoleSpy).toHaveBeenCalledTimes(1);

      const output = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('Отладочное сообщение');
    });
  });

  describe('verbose', () => {
    it('должен выводить сообщение через console.log', () => {
      const logger = new JsonLogger();
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      logger.verbose('Подробное сообщение');

      expect(consoleSpy).toHaveBeenCalledTimes(1);

      const output = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('verbose');
      expect(parsed.message).toBe('Подробное сообщение');
    });
  });
});
