import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Transaction } from 'typeorm';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';

@Processor('createOrder')
export class OrderProcessor {
  //   constructor(
  //     @InjectRepository(Transaction)
  //     private txRepository: MongoRepository<Transaction>,
  //   ) {}

  @Process('orderQ')
  async transcode(job: Job<any>) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date();
    end.setUTCHours(23, 59, 59, 999);
    const { merchantAddr, tokenAddr, chainId } = job.data;

    // const findLastOrder = await this.txRepository.findAndCount({
    //   where: {
    //     merchantAddress: merchantAddr,
    //     tokenAdress: tokenAddr,
    //     chainId,
    //     createdAt: {
    //       $gte: new Date(start.getTime()),
    //       $lt: new Date(end.getTime()),
    //     },
    //   },
    // });
    // return { name: findLastOrder[1] + 1 };
  }

  @OnQueueWaiting()
  onWaiting(jobId: string) {
    console.log(`OnQueueWaiting : ${jobId}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    console.log({ result });
  }

  @OnQueueFailed()
  onFailed(jobId: string) {
    console.log(`On fail : ${jobId}`);
  }
}
