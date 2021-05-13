import { TestBed } from '@angular/core/testing';

import { PutawayPolicyService } from './putaway-policy.service';

describe('PutawayPolicyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PutawayPolicyService = TestBed.get(PutawayPolicyService);
    expect(service).toBeTruthy();
  });
});
