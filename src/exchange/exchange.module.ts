import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { EXCHANGE_SERVICE } from './core';
import { ExchangeController } from './exchange.controller';
import { CoinbaseExchangeService } from './providers/coinbase-exchange.service';

@Module({
  imports: [HttpModule],
  controllers: [ExchangeController],
  providers: [
    {
      provide: EXCHANGE_SERVICE,
      useClass: CoinbaseExchangeService,
    },
  ],
})
export class ExchangeModule {}
