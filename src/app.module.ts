import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Transaction } from './entities/tx.entity';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from './app.processor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://mongo:1234@localhost:27017/',
      database: 'fins',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Transaction]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      limiter: {
        max: 1,
        duration: 1000,
        bounceBack: false,
      },
    }),
    BullModule.registerQueue({
      name: 'createOrder',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, OrderProcessor],
})
export class AppModule {}
