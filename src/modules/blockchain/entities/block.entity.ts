import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { AddressEntity } from "./address.entity";
import { TransactionEntity } from "./tx.entity";
import { Exclude } from "class-transformer";

@Entity('Block')
export class BlockEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false, unique: true })
  number: number;

  // 0x + hash
  @Column({ type: 'varchar', length: 66, nullable: true })
  hash: string;

  @Column({ type: 'varchar', length: 66, nullable: false })
  parentHash: string;

  // 0x689056015818adbe
  @Column({ type: 'varchar', nullable: false })
  nonce: string;

  // 0x4ea3f27bc
  @Column({ type: 'bigint', nullable: false })
  difficulty: bigint;

  // 0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32
  @Column({ type: 'varchar', nullable: false })
  extraData: string;

  // (, 30_000_000)
  @Column({ type: 'bigint', nullable: false })
  gasLimit: bigint;

  @Column({ type: 'bigint', nullable: false })
  gasUsed: bigint;

  @Column({ type: 'bigint', name: 'timestamp', nullable: false })
  timestamp: number;

  @Column({ type: 'bigint', nullable: true })
  baseFeePerGas: bigint;
  
  @OneToMany(() => TransactionEntity, (tx) => tx.block, {
    cascade: true
  })
  transactions: Relation<TransactionEntity>[];

  // 0x + account
  @ManyToOne(() => AddressEntity)
  miner: Relation<AddressEntity>;
}