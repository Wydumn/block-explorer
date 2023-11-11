import { Module } from '@nestjs/common';
import { BlockController } from './controllers/block.controller';
import { TxController } from './controllers/tx.controller';
import { AccountController } from './controllers/account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import * as entities from './entities';
import * as repositories from './repositories';
import * as services from './services';
import { BullModule } from '@nestjs/bull';
import { BlockProcessor } from './processors/block.processor';


@Module({
    controllers: [
        BlockController,
        TxController,
        AccountController,
    ],
    providers: [
        ...Object.values(services),
    ],
    imports: [
        TypeOrmModule.forFeature(Object.values(entities)),
        DatabaseModule.forRepository(Object.values(repositories)),
        BullModule.registerQueue({
            name: 'block'
        })
    ]
})
export class BlockchainModule {}
