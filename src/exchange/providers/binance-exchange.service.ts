import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { appOptions } from '../../app.options';
import { ExchangeService, FetchingTickerPriceError, Ticker, TickerPrice } from '../core';

@Injectable()
export class BinanceExchangeService implements ExchangeService {
  public constructor(
    private readonly config: ConfigService,
    public readonly httpService: HttpService,
  ) {}

  private readonly binanceApi = this.config.get<string>(appOptions.binanceApi);
  private readonly logger = new Logger(BinanceExchangeService.name);

  public async getTickerPrice(ticker: Ticker): Promise<TickerPrice> {
    try {
      const url = `${this.binanceApi}ticker/price?symbol=${ticker}`;
      const response = await lastValueFrom(this.httpService.get(url));

      if (!response) {
        const error = new FetchingTickerPriceError(ticker);
        this.logger.error(error);
        throw error;
      }

      return response.data;
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
