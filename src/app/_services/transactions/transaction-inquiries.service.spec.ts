import { TestBed } from '@angular/core/testing';

import { TransactionInquiriesService } from './transaction-inquiries.service';

describe('TransactionInquiriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionInquiriesService = TestBed.get(TransactionInquiriesService);
    expect(service).toBeTruthy();
  });
});
