import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobscheduleduleHistoryComponent } from './jobscheduledule-history.component';

describe('JobscheduleduleHistoryComponent', () => {
  let component: JobscheduleduleHistoryComponent;
  let fixture: ComponentFixture<JobscheduleduleHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobscheduleduleHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobscheduleduleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
