import { TestBed } from '@angular/core/testing';

import { SerialNoService } from './serial-no.service';

describe('SerialNoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerialNoService = TestBed.get(SerialNoService);
    expect(service).toBeTruthy();
  });
});
