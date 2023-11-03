import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/tx.entity';
import { TransactionProcessor } from './transaction.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BullModule.registerQueue({
      name: 'transaction',
      redis: {
        host: 'localhost',
        port: 6379,
      },
      limiter: {
        max: 1,
        duration: 100,
      },
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionProcessor],
})
export class TransactionModule {}
