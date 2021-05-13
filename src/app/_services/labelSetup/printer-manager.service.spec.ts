import { TestBed } from '@angular/core/testing';

import { PrinterManagerService } from './printer-manager.service';

describe('PrinterManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrinterManagerService = TestBed.get(PrinterManagerService);
    expect(service).toBeTruthy();
  });
});
