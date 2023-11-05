import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../entities/tx.entity';
import { BaseService } from '@/modules/database/base';
import { TransactionRepository } from '../repositories/tx.repository';
import { CreateTxDto } from '../dtos/tx.dto';
import { AddressRepository, BlockRepository } from '../repositories';
import { isNil } from 'lodash';

@Injectable()
export class TransactionService extends BaseService<TransactionEntity, TransactionRepository> {
    constructor(
        private txRepository: TransactionRepository,
        private blockRepository: BlockRepository,
        private addressRepository: AddressRepository
    ) {
        super(txRepository);
    }

    async create(data: CreateTxDto) {
        const createTxDto = {
            ...data,
            block: await this.blockRepository.findOne({ where: { hash: data.blockHash } }),
            from: await this.addressRepository.findOne({ where: { address: data.from } }),
            to: isNil(data.to) ? null : await this.addressRepository.findOne({ where: { address: data.to } }),
        };
        return await this.txRepository.save(createTxDto);
    }

    async getTransactionByHash(hash: string) {
        return this.txRepository.findOne({
            where: { hash },
        });
    }

    async getTransactionByBlockNumber(blockNumber: number) {
        return this.txRepository.findOne({
            where: { blockNumber },
        });
    }
}
