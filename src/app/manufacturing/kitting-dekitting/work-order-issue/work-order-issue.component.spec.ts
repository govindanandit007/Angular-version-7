import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderIssueComponent } from './work-order-issue.component';

describe('WorkOrderIssueComponent', () => {
  let component: WorkOrderIssueComponent;
  let fixture: ComponentFixture<WorkOrderIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
