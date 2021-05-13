import { TestBed } from '@angular/core/testing';

import { OperatingUnitService } from './operating-unit.service';

describe('OperatingUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperatingUnitService = TestBed.get(OperatingUnitService);
    expect(service).toBeTruthy();
  });
});
