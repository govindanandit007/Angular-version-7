import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTxnHistoryComponent } from './billing-txn-history.component';

describe('BillingTxnHistoryComponent', () => {
  let component: BillingTxnHistoryComponent;
  let fixture: ComponentFixture<BillingTxnHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingTxnHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingTxnHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
