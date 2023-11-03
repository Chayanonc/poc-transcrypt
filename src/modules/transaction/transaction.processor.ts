import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Transaction } from 'ethers';
import { MongoRepository } from 'typeorm';

@Processor('transaction')
export class TransactionProcessor {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: MongoRepository<Transaction>,
  ) {}

  @Process('orderQ')
  async createOrderQ(job: Job<any>) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date();
    end.setUTCHours(23, 59, 59, 999);
    const { merchantAddr, tokenAddr, chainId } = job.data;

    const findLastOrder = await this.txRepo.findAndCount({
      where: {
        merchantAddress: merchantAddr,
        tokenAdress: tokenAddr,
        chainId,
        createdAt: {
          $gte: new Date(start.getTime()),
          $lt: new Date(end.getTime()),
        },
      },
    });
    return { runningNumber: findLastOrder[1] + 1 };
  }
}
