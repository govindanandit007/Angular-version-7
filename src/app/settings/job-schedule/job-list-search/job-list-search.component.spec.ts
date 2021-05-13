import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListSearchComponent } from './job-list-search.component';

describe('JobListSearchComponent', () => {
  let component: JobListSearchComponent;
  let fixture: ComponentFixture<JobListSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobListSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
