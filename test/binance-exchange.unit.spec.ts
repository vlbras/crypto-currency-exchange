import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { FetchingTickerPriceError, Ticker } from '../src/exchange/core';
import { BinanceExchangeService } from '../src/exchange/providers/binance-exchange.service';

describe('BinanceExchangeService', () => {
  const mockApi = 'binance.com/api/';
  const ticker = Ticker.BTC_USDT;
  const fetchingErrorMsg = 'Error fetching ticker price: ';

  let service: BinanceExchangeService;
  let httpService: HttpService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue(mockApi),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BinanceExchangeService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<BinanceExchangeService>(BinanceExchangeService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTickerPrice', () => {
    it('should return ticker price data when API call is successful', async () => {
      const mockResponse = { data: { symbol: ticker, price: '90000' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getTickerPrice(ticker);

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${mockApi}ticker/price?symbol=${ticker}`);
    });

    it('should throw an error if the response is empty', async () => {
      mockHttpService.get.mockReturnValue(of(null));

      try {
        await service.getTickerPrice(ticker);
      } catch (error) {
        expect(error).toBeInstanceOf(FetchingTickerPriceError);
        expect(error.message).toBe(fetchingErrorMsg + ticker);
        expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });

    it('should handle errors when the API call fails', async () => {
      const errorMessage = 'API request failed';
      const mockError = new Error(errorMessage);
      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      try {
        await service.getTickerPrice(ticker);
      } catch (error) {
        expect(error).toBeInstanceOf(FetchingTickerPriceError);
        expect(error.message).toBe(fetchingErrorMsg + errorMessage);
        expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });
});
