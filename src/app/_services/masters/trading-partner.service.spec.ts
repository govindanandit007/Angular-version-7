import { TestBed } from '@angular/core/testing';

import { TradingPartnerService } from './trading-partner.service';

describe('TradingPartnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TradingPartnerService = TestBed.get(TradingPartnerService);
    expect(service).toBeTruthy();
  });
});
