import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingExecutionListComponent } from './billing-execution-list.component';

describe('BillingExecutionListComponent', () => {
  let component: BillingExecutionListComponent;
  let fixture: ComponentFixture<BillingExecutionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingExecutionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingExecutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
