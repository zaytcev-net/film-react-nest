import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('должен формировать сообщение в формате TSKV', () => {
      const logger = new TskvLogger();

      const result = logger.formatMessage('log', 'Тестовое сообщение');

      expect(result).toMatch(
        /^timestamp=.*\tlevel=log\tmessage=Тестовое сообщение\toptionalParams=\[\]$/,
      );
    });

    it('должен сохранять дополнительные параметры', () => {
      const logger = new TskvLogger();

      const result = logger.formatMessage(
        'error',
        'Ошибка',
        'Дополнительная информация',
        404,
      );

      expect(result).toContain('\tlevel=error\t');
      expect(result).toContain('\tmessage=Ошибка\t');
      expect(result).toContain(
        'optionalParams=["Дополнительная информация",404]',
      );
    });

    it('должен экранировать специальные символы', () => {
      const logger = new TskvLogger();

      const result = logger.formatMessage(
        'log',
        'Первая строка\nВторая строка\tТретья строка\r',
      );

      expect(result).toContain(
        'message=Первая строка\\nВторая строка\\tТретья строка\\r',
      );
    });

    it('должен экранировать обратный слеш', () => {
      const logger = new TskvLogger();

      const result = logger.formatMessage('log', 'Путь: C:\\folder');

      expect(result).toContain('message=Путь: C:\\\\folder');
    });
  });

  describe('log', () => {
    it('должен выводить сообщение через console.log', () => {
      const logger = new TskvLogger();
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      logger.log('Обычное сообщение');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('level=log');
      expect(consoleSpy.mock.calls[0][0]).toContain(
        'message=Обычное сообщение',
      );
    });
  });

  describe('error', () => {
    it('должен выводить сообщение через console.error', () => {
      const logger = new TskvLogger();
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      logger.error('Ошибка');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('level=error');
    });
  });

  describe('warn', () => {
    it('должен выводить сообщение через console.warn', () => {
      const logger = new TskvLogger();
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      logger.warn('Предупреждение');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('level=warn');
    });
  });

  describe('debug', () => {
    it('должен выводить сообщение через console.debug', () => {
      const logger = new TskvLogger();
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => {});

      logger.debug('Отладка');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('level=debug');
    });
  });

  describe('verbose', () => {
    it('должен выводить сообщение через console.log', () => {
      const logger = new TskvLogger();
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      logger.verbose('Подробное сообщение');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('level=verbose');
    });
  });
});
