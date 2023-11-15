import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlockService } from './block.service';
import { isNil } from 'lodash';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import Redis from 'ioredis';

@Injectable()
export class SyncService {
    constructor(
        private blockService: BlockService,
        @Inject('REDIS_CLIENT') private client: Redis,
        @InjectQueue('block') private blockQueue: Queue,
    ) {}

    // find block height of forked block
    async findFork(blockNumber: number, hash: string) {
        // iterate block before the block, compare hash with latestBlock hash
        let lastBlockNumber = blockNumber - 1;
        /* let lastBlock = await this.blockService.getBlockByNumber(lastBlockNumber);

        while (lastBlock.hash !== hash) {
            lastBlockNumber = lastBlockNumber - 1;
            lastBlock = await this.blockService.getBlockByNumber(lastBlockNumber);
        } */
        return lastBlockNumber + 1;
    }

    // delete block(include txs) after the fork block
    async rollback(currentBlockNumber: number, forkHeight: number) {
        for (let i = currentBlockNumber; i >= forkHeight; i--) {
            await this.blockService.remove(i);
        }
    }

    async calculateBlockRanges() {
        const currentBlockNumber = await this.client.get('blockNumber');
        const startBlock = isNil(currentBlockNumber) ? 0 : parseInt(currentBlockNumber);
        const BLOCKS_PER_REQUST = 200,
            CONCURRENCY_NUM = 5;
            
        let res = [];
        for (let i = 0; i < CONCURRENCY_NUM; i++) {
            res.push({
                start: startBlock + BLOCKS_PER_REQUST * i + 1,
                end: startBlock + BLOCKS_PER_REQUST * (i + 1),
            });
        }
        return res;
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async sync() {
        const blockRanges = await this.calculateBlockRanges();

        await this.blockQueue.addBulk(
            blockRanges.map((range) => ({
                name: 'requestBlock',
                data: {
                    start: range.start,
                    end: range.end,
                },
                opts: { attempts: 3, backoff: 3000 },
            })),
        );

        await this.client.set('blockNumber', blockRanges[blockRanges.length - 1].end);

        /* if (!syncedBlock) {
            // genesis block
            await this.syncBlock(0);
        } else if (syncedBlock.number < latestBlock.number) {
            // left behind, just sync + 1
            await this.syncBlock(syncedBlock.number + 1);
        } else {
            // syncedBlock.number == latestBlock.number
            const latestBlockHash = latestBlock.hash;
            if (syncedBlock.hash !== latestBlockHash) {
                // which is the fork happended on chain.
    
                // 1. stop sync process
                // stopSync();
                // 2. findFork
                const forkHeight = await this.findFork(syncedBlock.number, latestBlockHash);
                // 3. rollback
                await this.rollback(syncedBlock.number, forkHeight);
            }
        } */
    }
}
