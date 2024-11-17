import { HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import * as request from 'supertest';

import { EXCHANGE_SERVICE, Ticker } from '../src/exchange/core';
import { ExchangeController } from '../src/exchange/exchange.controller';
import { BinanceExchangeService } from '../src/exchange/providers/binance-exchange.service';

describe('ExchangeController', () => {
  const ticker = Ticker.BTC_USDT;

  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: EXCHANGE_SERVICE,
          useClass: BinanceExchangeService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the ticker price', async () => {
    const mockTickerPrice = { symbol: ticker, price: '90000.00' };
    jest.spyOn(httpService, 'get').mockReturnValue(of({ data: mockTickerPrice } as any));

    const response = await request(app.getHttpServer()).get('/exchange/ticker-price').query({ ticker }).expect(200);

    expect(response.body).toEqual(mockTickerPrice);
  });

  it('should return 422 if the API fails', async () => {
    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw new Error('API request failed');
    });

    await request(app.getHttpServer())
      .get('/exchange/ticker-price')
      .query({ ticker })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });
});
