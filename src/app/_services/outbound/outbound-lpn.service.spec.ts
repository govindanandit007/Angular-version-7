import { TestBed } from '@angular/core/testing';

import { OutboundLpnService } from './outbound-lpn.service';

describe('OutboundLpnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutboundLpnService = TestBed.get(OutboundLpnService);
    expect(service).toBeTruthy();
  });
});
