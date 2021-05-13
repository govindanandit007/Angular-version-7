import { TestBed } from '@angular/core/testing';

import { PrintHistoryService } from './print-history.service';

describe('PrintHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintHistoryService = TestBed.get(PrintHistoryService);
    expect(service).toBeTruthy();
  });
});
