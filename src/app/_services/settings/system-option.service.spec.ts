import { TestBed } from '@angular/core/testing';

import { SystemOptionService } from './system-option.service';

describe('SystemOptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemOptionService = TestBed.get(SystemOptionService);
    expect(service).toBeTruthy();
  });
});
