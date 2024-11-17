import { Controller, Get, Inject, Query } from '@nestjs/common';

import { ExchangeService, EXCHANGE_SERVICE, TickerPrice } from './core';
import { GetTickerPriceQuery } from './dto';

@Controller('exchange')
export class ExchangeController {
  public constructor(@Inject(EXCHANGE_SERVICE) private readonly exchangeService: ExchangeService) {}

  @Get('ticker-price')
  public async getTickerPrice(@Query() query: GetTickerPriceQuery): Promise<TickerPrice> {
    return this.exchangeService.getTickerPrice(query.ticker);
  }
}
