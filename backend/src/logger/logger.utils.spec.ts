import { describe, expect, it } from '@jest/globals';
import { stringifyValue } from './logger.utils';

describe('stringifyValue', () => {
  it('должен возвращать строку без изменений', () => {
    expect(stringifyValue('Привет')).toBe('Привет');
  });

  it('должен преобразовывать число в строку', () => {
    expect(stringifyValue(42)).toBe('42');
  });

  it('должен преобразовывать объект в JSON', () => {
    const value = { name: 'Фильм', year: 2026 };

    expect(stringifyValue(value)).toBe('{"name":"Фильм","year":2026}');
  });

  it('должен преобразовывать массив в JSON', () => {
    expect(stringifyValue([1, 2, 3])).toBe('[1,2,3]');
  });

  it('должен корректно обрабатывать null', () => {
    expect(stringifyValue(null)).toBe('null');
  });

  it('должен корректно обрабатывать undefined', () => {
    expect(stringifyValue(undefined)).toBe('undefined');
  });

  it('должен преобразовывать Error в JSON с информацией об ошибке', () => {
    const error = new Error('Что-то пошло не так');
    const result = JSON.parse(stringifyValue(error));

    expect(result.name).toBe('Error');
    expect(result.message).toBe('Что-то пошло не так');
    expect(result.stack).toEqual(expect.any(String));
  });

  it('должен обрабатывать объект с циклической ссылкой', () => {
    const value: Record<string, unknown> = {};
    value.self = value;

    expect(stringifyValue(value)).toBe('[object Object]');
  });
});
