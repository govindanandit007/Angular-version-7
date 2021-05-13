import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobHistorySearchComponent } from './job-history-search.component';

describe('JobHistorySearchComponent', () => {
  let component: JobHistorySearchComponent;
  let fixture: ComponentFixture<JobHistorySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobHistorySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobHistorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
