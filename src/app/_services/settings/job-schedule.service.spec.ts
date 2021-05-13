import { TestBed } from '@angular/core/testing';

import { JobScheduleService } from './job-schedule.service';

describe('JobScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobScheduleService = TestBed.get(JobScheduleService);
    expect(service).toBeTruthy();
  });
});
