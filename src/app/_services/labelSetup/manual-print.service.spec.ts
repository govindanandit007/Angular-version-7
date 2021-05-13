import { TestBed } from '@angular/core/testing';

import { ManualPrintService } from './manual-print.service';

describe('ManualPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManualPrintService = TestBed.get(ManualPrintService);
    expect(service).toBeTruthy();
  });
});
