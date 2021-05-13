import { TestBed } from '@angular/core/testing';

import { AddFieldSetupService } from './add-field-setup.service';

describe('AddFieldSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddFieldSetupService = TestBed.get(AddFieldSetupService);
    expect(service).toBeTruthy();
  });
});
