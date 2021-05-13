import { TestBed } from '@angular/core/testing';

import { StockLocatorService } from './stock-locator.service';

describe('StockLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockLocatorService = TestBed.get(StockLocatorService);
    expect(service).toBeTruthy();
  });
});
