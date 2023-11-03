import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IOrder } from './interfaces/order.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await this.appService.generateQr();
  }

  @Post('/generate-qr')
  generateQr(@Body() body: any) {
    const { amount, chainId, tokenName } = body;
    return this.appService.generateQr(amount, chainId, tokenName);
  }

  @Post('/create-order')
  async createOrder(
    @Body()
    body: IOrder,
  ) {
    return await this.appService.createOrder(body);
  }

  @Post('/confirm-tx')
  async confirmTransaction(@Body() body: any) {
    return this.appService.confirmTransaction(body);
  }
}
