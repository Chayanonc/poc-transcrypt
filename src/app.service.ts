import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';
import { Transaction, txStatus } from './entities/tx.entity';
import { User } from './entities/user.entity';
import { IOrder } from './interfaces/order.interface';
import { calAcceptAmount } from './utils/getAcceptableNumber';
import { formatEIP681 } from './utils/formatEIP681';
import * as qrcode from 'qrcode';
import { getOrderIdFromAmount } from './utils/getOrderId';
import { ObjectId } from 'mongodb';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,

    @InjectRepository(Transaction)
    private readonly txRepository: MongoRepository<Transaction>,

    @InjectQueue('createOrder') private orderQueue: Queue,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async generateQr(amount?: string, chainId?: number, tokenName?: string) {
    // const user = new User();
    // user.firstName = 'Timber';
    // user.lastName = 'Saw';
    // const newUser = await this.userRepository.save(user);
    // return newUser;
  }

  async createOrder(body: IOrder) {
    const { amount, chainId, merchantAddr, tokenAddr } = body;

    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date();
    end.setUTCHours(23, 59, 59, 999);

    const findLastOrder = await this.txRepository.findAndCount({
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

    const orderNumber = findLastOrder[1] + 1;

    const newAmount = calAcceptAmount(amount, 18, orderNumber);

    const eip681Native = formatEIP681.ethPayment(merchantAddr, newAmount);
    const eip681Token = formatEIP681.erc20Transfer(
      tokenAddr,
      merchantAddr,
      newAmount,
      chainId,
    );

    const qrNative = await qrcode.toString(eip681Native);
    const qrToken = await qrcode.toString(eip681Token);

    console.log({ qrNative, qrToken });

    if (!newAmount) {
      return new Error('Token limit');
    }

    const job = await this.orderQueue.add(
      'alice',
      {
        name: 'alice',
      },
      {
        delay: 2000,
        timeout: 10000,
        removeOnComplete: true,
      },
    );

    const jobIscomplete = await job.isCompleted();

    // console.log({ jobIscomplete });

    const tx = this.txRepository.create({
      tokenAmount: amount,
      chainId: chainId,
      exchangeRate: '30',
      status: txStatus.PENDING,
      merchantAddress: merchantAddr,
      tokenAdress: tokenAddr,
      runningNumber: orderNumber,
    });

    try {
      return await this.txRepository.save(tx);
    } catch (error) {
      return error;
    }

    return tx;
  }

  async confirmTransaction(body: any) {
    const { txId, amount } = body;

    console.log({ txId, amount });

    const runningNumber = getOrderIdFromAmount(amount, 18);
    console.log(runningNumber);

    const tx = this.txRepository.findOne({
      where: {
        _id: new ObjectId(txId),
        runningNumber,
      },
    });

    return tx;
  }
}
