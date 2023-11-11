import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { BlockService, EthersService } from '../services';
import { Job, Queue } from 'bull';
import { Block, TransactionHash } from 'web3';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Processor('block')
export class BlockProcessor {
	constructor(
		private ethersService: EthersService,
		private blockService: BlockService,
		@Inject('REDIS_CLIENT') private client: Redis,
        @InjectQueue('block') private blockQueue: Queue,
	) {}

    @Process('requestBlock')
    async requestBlocks(job: Job<{ start: number; end: number }>) {
        const { start, end } = job.data;
        const blocks = await this.ethersService.getBlocksByRange(start, end);
        const parsedBlocks = blocks.map(
            (data) =>
                ({
                    ...data,
                    transactions: data.transactions.map(
                        (tx) =>
                            (typeof tx === 'string' ? tx : tx.hash.toString()) as TransactionHash,
                    ),
                }) as Block,
        );

        // push to queue
        await this.blockQueue.add('storeBlocks', { parsedBlocks });
        await this.client.set('blockNumber', end);
    }

    @Process('storeBlocks')
    async storeBlocks(job: Job<{ parsedBlocks: Block[] }>) {
        const { parsedBlocks } = job.data;
        await this.blockService.bulkInsert(parsedBlocks);
        console.log(
            '+++++++++++++++++++++++++++ storeblocks job +++++++++++++++++++++++++++++',
            // parsedBlocks,
        );
    }
}
