import { TestBed } from '@angular/core/testing';

import { SubInventoryService } from './sub-inventory.service';

describe('SubInventoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubInventoryService = TestBed.get(SubInventoryService);
    expect(service).toBeTruthy();
  });
});
