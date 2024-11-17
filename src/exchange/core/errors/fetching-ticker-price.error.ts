import { HttpException, HttpStatus } from '@nestjs/common';

export class FetchingTickerPriceError extends HttpException {
  public constructor(message: string, statusCode: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY) {
    super('Error fetching ticker price: ' + message, statusCode);
  }
}
