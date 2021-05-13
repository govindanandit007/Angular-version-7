import { TestBed } from '@angular/core/testing';

import { CycleCountService } from './cycle-count.service';

describe('CycleCountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CycleCountService = TestBed.get(CycleCountService);
    expect(service).toBeTruthy();
  });
});
