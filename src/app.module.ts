import { Module } from '@nestjs/common';

import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { database, elastic } from './config';
import { CoreModule } from './modules/core/core.module';
import { AppFilter, AppIntercepter, AppPipe } from './modules/core/providers';
import { DatabaseModule } from './modules/database/database.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ElasticModule } from './modules/elastic/elastic.module';

@Module({
    imports: [
        CoreModule.forRoot(),
        DatabaseModule.forRoot(database),
        ElasticModule.forRoot(elastic),
        BlockchainModule,
        ScheduleModule.forRoot(),
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            }
        })
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new AppPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
        {
            provide: APP_FILTER,
            useClass: AppFilter,
        },
    ],
})
export class AppModule {}
