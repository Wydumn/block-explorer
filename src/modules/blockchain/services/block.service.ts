import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddressRepository, BlockRepository } from '../repositories';
import { CreateBlockDto } from '../dtos/block.dto';
import { PaginateOptions } from '@/modules/database/types';
import { paginate } from '@/modules/database/helpers';
import { BaseService } from "@/modules/database/base";
import { BlockEntity } from '../entities';
import { SearchService } from './search.service';

@Injectable()
export class BlockService extends BaseService<BlockEntity, BlockRepository> {
    constructor(
        private blockRepository: BlockRepository,
        private addressRepository: AddressRepository,
        private searchService: SearchService,
    ) {
        super(blockRepository);
    }

    async paginate(options: PaginateOptions) {
        return paginate(this.blockRepository.buildBaseQB(), options);
    }
    
    async create(data: CreateBlockDto) {
        const createBlockDto = {
            ...data,
            miner: await this.addressRepository.findOne({ where: [{ address: data.miner }] })
        }
        return await this.blockRepository.save(createBlockDto);
    }

    async getLatestBlock() {
        return await this.blockRepository
            .createQueryBuilder('block')
            .orderBy('block.number', 'DESC')
            .limit(1)
            .getOne();
    }

    async getAllBlocks() {
        return await this.blockRepository.find();
    }

    async getBlockByNumber(blockNumber: number) {
        return this.blockRepository.findOne({
            where: [{ number: blockNumber }],
        });
    }

    async getBlockByHash(hash: string) {
        return this.blockRepository.findOne({
            where: [{ hash }],
        });
    }

    async updateBlock() {}

    async remove(blockNumber: number) {
        const block = await this.getBlockByNumber(blockNumber);
        return this.blockRepository.remove(block);
    }

}
