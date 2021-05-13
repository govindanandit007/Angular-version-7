import { TestBed } from '@angular/core/testing';

import { AsnService } from './asn.service';

describe('AsnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsnService = TestBed.get(AsnService);
    expect(service).toBeTruthy();
  });
});
