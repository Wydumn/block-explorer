import { Injectable, ValidationPipe } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EthersService } from './ethers.service';
import { BlockService } from './block.service';
import { TransactionService } from './tx.service';
import { CreateBlockDto } from '../dtos/block.dto';
import { AddressService } from './address.service';
import { AddressRepository } from '../repositories';
import { CreateAddressDto } from '../dtos/address.dto';
import { CreateTxDto } from '../dtos/tx.dto';
import { omit } from 'lodash';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Injectable()
@Processor('syncTx')
export class SyncService {
    constructor(
        private ethersService: EthersService,
        private blockService: BlockService,
        private txService: TransactionService,
        private addressService: AddressService,
        private addressRepository: AddressRepository,
        @InjectQueue('syncTx') private retryQueue: Queue,
    ) {}

    async syncAddress(address: string) {
        const addrDetail = await this.addressRepository.findOne({ where: { address } });

        let nonce, balance;

        [nonce, balance] = await Promise.all([
            await this.ethersService.getTransactionCount(address),
            await this.ethersService.getBalance(address),
        ]);

        const addressObj = {
            address,
            balance,
            nonce,
        };

        // console.log("\n =========== addressObj ================================= \n", addressObj);
        const addressDto = await new ValidationPipe({
            skipMissingProperties: true,
        }).transform(addressObj, {
            type: 'body',
            metatype: CreateAddressDto,
        });
        // if address already exists, update
        try {
            if (!addrDetail) {
                await this.addressService.create(addressDto);
            } else {
                await this.addressService.update({
                    ...addressDto,
                    id: addrDetail.id,
                });
            }
        } catch (err) {
            console.log(
                '\n =========== addressDto ================================= \n',
                addressDto,
            );
        }
    }

    async syncTx(transactions: readonly string[]) {
        for (const tx of transactions) {
            // find tx in db
            const transaction = await this.txService.getTransactionByHash(tx);
            if (!transaction) {
                // create tx if not exist
                const txDetail = await this.ethersService.getTransaction(tx);
                const addresses = [txDetail.from, txDetail.to];

                // create accounts for from and to
                for (const addr of addresses) {
                    if (addr) {
                        await this.syncAddress(addr);
                    }
                }

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
                    await this.retryQueue.add({
                        txSyncRetry: txDto,
                    });
                }
            } else {
                // if hard fork
            }
        }
    }

    async syncBlock(blockNumber: number) {
        const block = await this.ethersService.getBlock(blockNumber);

        // create miner
        // if address already exists, update
        await this.syncAddress(block.miner);

        // validate and create new block
        const blockDto = await new ValidationPipe({
            skipMissingProperties: true,
        }).transform(block, {
            type: 'body',
            metatype: CreateBlockDto,
        });

        await this.blockService.create(blockDto);
        // create tx after block creation
        await this.syncTx(block.transactions);
    }

    @Process()
    async retryFailedTx(job: Job) {
        console.log(job);
    }

    // find block height of forked block
    async findFork(blockNumber: number, hash: string) {
        // iterate block before the block, compare hash with latestBlock hash
        let lastBlockNumber = blockNumber - 1;
        let lastBlock = await this.blockService.getBlockByNumber(lastBlockNumber);

        while (lastBlock.hash !== hash) {
            lastBlockNumber = lastBlockNumber - 1;
            lastBlock = await this.blockService.getBlockByNumber(lastBlockNumber);
        }
        return lastBlockNumber + 1;
    }

    // delete block(include txs) after the fork block
    async rollback(currentBlockNumber: number, forkHeight: number) {
        for (let i = currentBlockNumber; i >= forkHeight; i--) {
            await this.blockService.remove(i);
        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async sync() {
        // "latest" block onchain
        const latestBlock = await this.ethersService.getLatestBlock();
        // latest block local
        const syncedBlock = await this.blockService.getLatestBlock();
        if (!syncedBlock) {
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
        }
            
    }
}
