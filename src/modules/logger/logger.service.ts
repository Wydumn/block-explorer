import { ConsoleLogger, ConsoleLoggerOptions, Injectable, LogLevel } from '@nestjs/common';
import { Appender, configure, getLogger, levels } from 'log4js';

// grade logs, set Nest Log to info
const LogLevelOrder: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];

@Injectable()
export class AppLoggerService extends ConsoleLogger {
  private MAX_LOGGER_FILES = 31;
  constructor(
    context: string,
    options: ConsoleLoggerOptions,
  ) {
    const level = 'verbose';
    const levelIndex = LogLevelOrder.findIndex((e) => e === level);
    if (levelIndex === -1) {
      throw new Error(`Invalid logger level, configurable level ${LogLevelOrder.join(',')}`);
    }

    super(context, {
      ...options,
      timestamp: true,
      logLevels: LogLevelOrder.slice(levelIndex),
    });

    this.initLog4js();
  }

  verbose(message: any, context?: string): void {
    super.verbose.apply(this, [message, context]);

    if (this.isLevelEnabled('verbose')) {
      getLogger('verbose').log('verbose', message);
    }
  }

  debug(message: any, context?: string): void {
    super.debug.apply(this, [message, context]);

    if (this.isLevelEnabled('debug')) {
      getLogger('debug').log('debug', message);
    }
  }

  log(message: any, context?: string): void {
    super.log.apply(this, [message, context]);

    if (this.isLevelEnabled('log')) {
      getLogger('info').log('info', message);
    }
  }

  warn(message: any, context?: string): void {
    super.warn.apply(this, [message, context]);

    if (this.isLevelEnabled('warn')) {
      getLogger('warn').log('warn', message);
    }
  }

  error(message: any, stack?: string, context?: string): void {
    super.error.apply(this, [message, stack, context]);

    if (this.isLevelEnabled('error')) {
      getLogger('error').log('error', message);
    }
  }

  private initLog4js() {
    levels.addLevels({
      VERBOSE: { value: 5000, colour: 'blue' },
      DEBUG: { value: 10000, colour: 'cyan' },
      INFO: { value: 20000, colour: 'green' },
      WARN: { value: 30000, colour: 'yellow' },
      ERROR: { value: 40000, colour: 'red' },
    });

    configure({
      appenders: {
        verbose: this.createAppenders('verbose'),
        debug: this.createAppenders('debug'),
        info: this.createAppenders('info'),
        warn: this.createAppenders('warn'),
        error: this.createAppenders('error'),
        console: {
          type: 'console',
        },
      },
      categories: {
        default: {
          appenders: ['console'],
          level: 'all',
        },
        verbose: {
          appenders: ['verbose'],
          level: 'all',
        },
        debug: {
          appenders: ['debug'],
          level: 'all',
        },
        info: {
          appenders: ['info'],
          level: 'all',
        },
        warn: {
          appenders: ['warn'],
          level: 'all',
        },
        error: {
          appenders: ['error'],
          level: 'all',
          enableCallStack: true,
        },
      },
    });
  }

  private createAppenders(level: LogLevel | 'info'): Appender {
    const enableCallStack = level === 'error';

    return {
      type: 'dateFile',
      filename: `logs/${level}`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true,
      numBackups: this.MAX_LOGGER_FILES,
      layout: {
        type: 'pattern',
        pattern:
          '[%h] %z %d{yyyy-MM-dd hh:mm:ss.SSS} %p %n%m' +
          `${enableCallStack ? ' %n%s' : ''}` +
          ' %n%x{divider}',
        tokens: {
          divider: '-'.repeat(150),
        },
      },
    };
  }
}
