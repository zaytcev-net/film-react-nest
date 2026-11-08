import { ConsoleLogger } from '@nestjs/common';
import { describe, expect, it } from '@jest/globals';
import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  it('должен наследоваться от ConsoleLogger', () => {
    const logger = new DevLogger();

    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('должен предоставлять стандартные методы логирования', () => {
    const logger = new DevLogger();

    expect(typeof logger.log).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.verbose).toBe('function');
  });
});
