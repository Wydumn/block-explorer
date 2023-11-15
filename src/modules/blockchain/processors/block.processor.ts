import { InjectQueue, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { BlockService, EthersService } from '../services';
import { Job, Queue } from 'bull';
import { Block, TransactionHash } from 'web3';
import { getErrorMessage } from '../helpers';
import { AppLoggerService } from '@/modules/logger/logger.service';

@Processor('block')
export class BlockProcessor {
	constructor(
		private ethersService: EthersService,
		private blockService: BlockService,
        @InjectQueue('block') private blockQueue: Queue,
        private logger: AppLoggerService
	) {}

    @Process('requestBlock')
    async requestBlocks(job: Job<{ start: number; end: number }>) {
        const { start, end } = job.data;

        const blocks = await this.ethersService.getBlocksByRange(start, end);
        this.logger.log(`block number from ${start} to ${end} request succeeded.`, BlockProcessor.name);

        if (blocks.length > 0) {
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
        }
    }

    @Process('storeBlocks')
    async storeBlocks(job: Job<{ parsedBlocks: Block[] }>) {
        const { parsedBlocks } = job.data;
        try {
            await this.blockService.bulkInsert(parsedBlocks);
        } catch(err) {
            job.moveToFailed({ message: getErrorMessage(err) });
        }
        this.logger.log(`block number from ${Number(parsedBlocks[0].number)} to ${Number(parsedBlocks[parsedBlocks.length-1].number)} insert succeeded.`, BlockProcessor.name);
    }
}
