import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum txStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity('transaction')
export class Transaction {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  txHash: string;

  @Column()
  fiatAmount: string;

  @Column()
  tokenAmount: string;

  @Column()
  exchangeRate: string;

  @Column({
    type: 'enum',
    enum: txStatus,
  })
  status: txStatus;

  @Column()
  runningNumber: number;

  @Column()
  customerAddress: string;

  @Column()
  merchantAddress: string;

  @Column()
  chainId: number;

  @Column()
  tokenAdress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
