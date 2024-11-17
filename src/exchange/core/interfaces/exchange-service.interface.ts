import { Ticker } from '../enum';
import { TickerPrice } from '../models';

export interface ExchangeService {
  getTickerPrice(ticker: Ticker): Promise<TickerPrice>;
}

export const EXCHANGE_SERVICE = Symbol('EXCHANGE_SERVICE');
