import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EthersService } from './ethers.service';
import { BlockService } from './block.service';
import { TransactionService } from './tx.service';
import { CreateTxDto } from '../dtos/tx.dto';
import { omit } from 'lodash';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import Redis from 'ioredis';

@Injectable()
export class SyncService {
    constructor(
        private ethersService: EthersService,
        private blockService: BlockService,
        private txService: TransactionService,
        @Inject('REDIS_CLIENT') private client: Redis,
        @InjectQueue('block') private blockQueue: Queue,
    ) {}

    async syncTx(transactions: readonly string[]) {
        for (const tx of transactions) {
            // find tx in db
            const transaction = await this.txService.getTransactionByHash(tx);
            if (!transaction) {
                // create tx if not exist
                const txDetail = await this.ethersService.getTransaction(tx);
                const addresses = [txDetail.from, txDetail.to];

                /* let txDto;
      try { */
                const txDto = await new ValidationPipe({
                    skipMissingProperties: true,
                    whitelist: true,
                }).transform(omit(txDetail, ['signature']), {
                    type: 'body',
                    metatype: CreateTxDto,
                });
                /* } catch (err) {
        // console.log(err, '\n', txDto, '\n', txDetail);
      } */

                // create transaction
                try {
                    await this.txService.create(txDto);
                } catch (err) {
                    console.log(err, '\n', txDto);
                    // add to queue
                }
            } else {
                // if hard fork
            }
        }
    }

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
        console.log(currentBlockNumber === null);
        const startBlock = currentBlockNumber === null ? 0 : parseInt(currentBlockNumber);
        console.log("================================== redis get ==========================", currentBlockNumber, startBlock);
        // set a variable name for the number of blocks that have been stored
        const BLOCKS_PER_REQUST= 200, CONCURRENCY_NUM = 5;
        let res = [];
        for (let i = 0; i < CONCURRENCY_NUM; i++) {
            res.push({
                start: startBlock + BLOCKS_PER_REQUST * i +  1,
                end: startBlock + BLOCKS_PER_REQUST * (i + 1)
            })
        }
        return res;
        
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async sync() {
        const blockRanges = await this.calculateBlockRanges();

        await Promise.all(
            blockRanges.map(
                (blockRange) =>
                    this.blockQueue.add('requestBlock', {
                        start: blockRange.start,
                        end: blockRange.end,
                    }),
                { attempts: 3, backoff: 2000 },
            ),
        );

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
