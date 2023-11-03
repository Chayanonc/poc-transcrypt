import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/create')
  async createTransaction(@Body() body: any) {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(
        new Promise((resolve, reject) => {
          resolve(this.transactionService.createTransaction(body));
        }),
      );
    }
    const results = await Promise.all(arr);
    return results;

    // return this.transactionService.createTransaction(body);
  }
}
