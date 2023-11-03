import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Transaction, txStatus } from 'src/entities/tx.entity';
import { formatEIP681 } from 'src/utils/formatEIP681';
import { calAcceptAmount } from 'src/utils/getAcceptableNumber';
import { MongoRepository } from 'typeorm';
import * as qrcode from 'qrcode';
import { IConvertToQRCode } from './interfaces/convertToQRcode.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: MongoRepository<Transaction>,

    @InjectQueue('transaction')
    private readonly txQ: Queue,
  ) {}

  async createTransaction(body: any) {
    const { amount, chainId, merchantAddr, tokenAddr } = body;

    const job = await this.txQ.add(
      'orderQ',
      { chainId, merchantAddr, tokenAddr },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
    const { runningNumber } = await job.finished();

    const newAmount = calAcceptAmount(amount, 18, runningNumber);

    if (!newAmount) {
      return new Error('Token limit');
    }

    const eip681Native = formatEIP681.ethPayment(merchantAddr, newAmount);
    const eip681Token = formatEIP681.erc20Transfer(
      tokenAddr,
      merchantAddr,
      newAmount,
      chainId,
    );

    const qrNative = await qrcode.toString(eip681Native);
    const qrToken = await qrcode.toString(eip681Token);

    // console.log({ qrNative, qrToken });

    const tx = this.txRepo.create({
      tokenAmount: amount,
      chainId: chainId,
      exchangeRate: '30',
      status: txStatus.PENDING,
      merchantAddress: merchantAddr,
      tokenAdress: tokenAddr,
      runningNumber,
    });

    try {
      const result = await this.txRepo.save(tx);
      return result.runningNumber;
    } catch (error) {
      return error;
    }
  }
}
