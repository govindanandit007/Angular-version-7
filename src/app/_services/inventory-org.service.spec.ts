import { TestBed } from '@angular/core/testing';

import { InventoryOrgService } from './inventory-org.service';

describe('InventoryOrgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryOrgService = TestBed.get(InventoryOrgService);
    expect(service).toBeTruthy();
  });
});
