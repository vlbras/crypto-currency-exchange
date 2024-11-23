import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { appOptions } from '../../app.options';
import { ExchangeService, FetchingTickerPriceError, Ticker, TickerPrice } from '../core';

@Injectable()
export class CoinbaseExchangeService implements ExchangeService {
  public constructor(
    private readonly config: ConfigService,
    public readonly httpService: HttpService,
  ) {}

  private readonly coinbaseApi = this.config.get<string>(appOptions.coinbaseApi);
  private readonly logger = new Logger(CoinbaseExchangeService.name);

  public async getTickerPrice(ticker: Ticker): Promise<TickerPrice> {
    try {
      const url = `${this.coinbaseApi}products/${ticker}/ticker`;
      const response = await lastValueFrom(this.httpService.get(url));

      if (!response) {
        const error = new FetchingTickerPriceError(ticker);
        this.logger.error(error);
        throw error;
      }

      return {
        symbol: ticker,
        price: response.data.price,
      };
    } catch (err) {
      if (err instanceof FetchingTickerPriceError) {
        throw err;
      }

      const error = new FetchingTickerPriceError(err.message, err.code);
      this.logger.error(error);
      throw error;
    }
  }
}
