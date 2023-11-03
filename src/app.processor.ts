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
  @Process('alice')
  async transcode(job: Job<any>) {
    console.log({ data: job.data });

    return { name: job.data?.name + '123' };
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
