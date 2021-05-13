import { TestBed } from '@angular/core/testing';

import { UnitOfMeasureService } from './unit-of-measure.service';

describe('UnitOfMeasureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnitOfMeasureService = TestBed.get(UnitOfMeasureService);
    expect(service).toBeTruthy();
  });
});
