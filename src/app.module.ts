import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ExchangeModule],
})
export class AppModule {}
