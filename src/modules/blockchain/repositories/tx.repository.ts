import { CustomRepository } from "@/modules/database/decorators";
import { TransactionEntity } from "../entities/tx.entity";
import { BaseRepository } from "@/modules/database/base";


@CustomRepository(TransactionEntity)
export class TransactionRepository extends BaseRepository<TransactionEntity> {
  protected _qbName = 'tx'
}