import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Address')
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  address: string;

  @Column({ type: 'varchar' })
  balance: string;

  @Column({ type: 'int' })
  nonce: number;
}