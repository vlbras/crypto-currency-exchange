import { IsEnum } from 'class-validator';

import { Ticker } from '../core/enum';

export class GetTickerPriceQuery {
  @IsEnum(Ticker)
  public readonly ticker: Ticker;
}
