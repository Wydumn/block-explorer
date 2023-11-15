import { DynamicModule, Module } from '@nestjs/common';
import { AppLoggerService } from './logger.service';

export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
      providers: [AppLoggerService],
      exports: [AppLoggerService],
    }
  }
}
