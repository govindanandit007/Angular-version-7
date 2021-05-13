import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTxnBillingHistoryComponent } from './search-txn-billing-history.component';

describe('SearchTxnBillingHistoryComponent', () => {
  let component: SearchTxnBillingHistoryComponent;
  let fixture: ComponentFixture<SearchTxnBillingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTxnBillingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTxnBillingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
