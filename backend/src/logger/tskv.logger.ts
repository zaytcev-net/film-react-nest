import { Injectable, LoggerService } from '@nestjs/common';
import { stringifyValue } from './logger.utils';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields = {
      timestamp: new Date().toISOString(),
      level,
      message: stringifyValue(message),
      optionalParams: JSON.stringify(optionalParams),
    };

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${this.escapeValue(value)}`)
      .join('\t');
  }

  private escapeValue(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n');
  }

  log(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
