import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobscheduleduleListComponent } from './jobscheduledule-list.component';

describe('JobscheduleduleListComponent', () => {
  let component: JobscheduleduleListComponent;
  let fixture: ComponentFixture<JobscheduleduleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobscheduleduleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobscheduleduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
