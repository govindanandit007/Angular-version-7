import { TestBed } from '@angular/core/testing';

import { MaterialStatusService } from './material-status.service';

describe('MaterialStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialStatusService = TestBed.get(MaterialStatusService);
    expect(service).toBeTruthy();
  });
});
