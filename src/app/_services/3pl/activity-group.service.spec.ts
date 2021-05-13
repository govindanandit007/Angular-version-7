import { TestBed } from '@angular/core/testing';

import { ActivityGroupService } from './activity-group.service';

describe('ActivityGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityGroupService = TestBed.get(ActivityGroupService);
    expect(service).toBeTruthy();
  });
});
