import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnBillingHistoryListComponent } from './txn-billing-history-list.component';

describe('TxnBillingHistoryListComponent', () => {
  let component: TxnBillingHistoryListComponent;
  let fixture: ComponentFixture<TxnBillingHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxnBillingHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxnBillingHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
