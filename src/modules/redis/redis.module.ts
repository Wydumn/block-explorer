import { DynamicModule, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisModuleOptions } from './types';

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule{
    return {
      module: RedisModule,
      global: true,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async () => {
            let client;
            if (options.url) {
              client = new Redis(options.url, options);
            }
            client = new Redis(options);

            return client;
          }
        }
      ],
      exports: ['REDIS_CLIENT']
    }
  }
}
