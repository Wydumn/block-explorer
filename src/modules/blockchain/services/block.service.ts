import { IndexService } from '@/modules/elastic/search.index';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Block } from 'web3';
import { blockMapping } from '../indices/block';
import { AppLoggerService } from '@/modules/logger/logger.service';

@Injectable()
export class BlockService extends IndexService {
    protected _indexName = 'blocks';
    constructor(esService: ElasticsearchService, logger: AppLoggerService) {
        super(esService, logger);
    }

    async createIndex(): Promise<void> {
        await this.esService.indices.create(blockMapping);
    }

    createBulk(block: Block) {
        return [
            {
                index: {
                    _index: this.indexName,
                    _id: block.number,
                },
            },
            {
                ...block,
                number: BigInt(block.number).toString(),
                timestamp: BigInt(block.timestamp).toString(),
            },
        ];
    }

    async bulkInsert(blocks: Block[]) {
        const data = blocks.flatMap((block) => this.createBulk(block));
        await this.esService.bulk({
            operations: data
        });
    }

    async getLatestBlock() {}

    // return first 100 blocks
    async getBlocks() {
        const { hits } = await this.esService.search({
            index: this.indexName,
            query: {},
        });

        return hits.hits.map(item => item._source);
    }

    async getBlockByNumber(blockNumber: number) {
        const { hits } = await this.esService.search({
            index: this.indexName,
            query: {
                term: { number: blockNumber },
            },
        });

        return hits.hits.map(item => item._source);
    }

    async getBlockByHash(hash: string) {
        const { hits } = await this.esService.search({
            index: this.indexName,
            query: {
                term: { hash },
            },
        });

        return hits.hits.map(item => item._source);
    }

    async updateBlock() {}

    async remove(blockNumber: number) {}
}
