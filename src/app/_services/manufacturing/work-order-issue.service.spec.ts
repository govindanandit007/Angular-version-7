import { TestBed } from '@angular/core/testing';

import { WorkOrderIssueService } from './work-order-issue.service';

describe('WorkOrderIssueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkOrderIssueService = TestBed.get(WorkOrderIssueService);
    expect(service).toBeTruthy();
  });
});
