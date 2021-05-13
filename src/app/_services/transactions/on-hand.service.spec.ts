import { TestBed } from '@angular/core/testing';

import { OnHandService } from './on-hand.service';

describe('OnHandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnHandService = TestBed.get(OnHandService);
    expect(service).toBeTruthy();
  });
});
