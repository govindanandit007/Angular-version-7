import { TestBed } from '@angular/core/testing';

import { MaterialStatusSetupService } from './material-status-setup.service';

describe('MaterialStatusSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialStatusSetupService = TestBed.get(MaterialStatusSetupService);
    expect(service).toBeTruthy();
  });
});
