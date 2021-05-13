import { TestBed } from '@angular/core/testing';

import { ActivityMasterService } from './activity-master.service';

describe('ActivityMasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityMasterService = TestBed.get(ActivityMasterService);
    expect(service).toBeTruthy();
  });
});
