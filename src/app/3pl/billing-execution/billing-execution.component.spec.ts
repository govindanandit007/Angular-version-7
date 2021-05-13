import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingExecutionComponent } from './billing-execution.component';

describe('BillingExecutionComponent', () => {
  let component: BillingExecutionComponent;
  let fixture: ComponentFixture<BillingExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
