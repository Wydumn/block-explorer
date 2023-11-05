import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { AddressEntity } from "./address.entity";
import { BlockEntity } from "./block.entity";

@Entity('Transaction')
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 66, nullable: false })
  blockHash: string;

  /* @Column({ type: 'int', nullable: false, default: 0 })
  index: number; */

  // null when pending
  @Column({ type: 'int', nullable: true })
  blockNumber: number;
  
  @ManyToOne(() => AddressEntity, {
    cascade: ['insert', 'update' ]
  })
  from: Relation<AddressEntity>;

  @Column({ type: 'bigint', nullable: false})
  gasLimit: bigint;
  
  @Column({ type: 'bigint', nullable: false })
  gasPrice: bigint;

  @Column({ type: 'varchar', length: 66, nullable: false })
  hash: string;

  @Column({ type: 'bigint', nullable: true })
  maxPriorityFeePerGas: bigint;

  @Column({ type: 'bigint', nullable: true })
  maxFeePerGas: bigint;

  @Column({ type: 'int', nullable: false })
  nonce: number;

  @ManyToOne(() => AddressEntity, {
    cascade: ['insert', 'update' ]
  })
  to: Relation<AddressEntity>;

  @Column({ type: 'longtext', nullable: false })
  data: string;

  @Column({ type: 'varchar', name: 'value', nullable: false })
  value: string;

  @ManyToOne(() => BlockEntity)
  block: Relation<BlockEntity>;
}