import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInquiriesSearchComponent } from './transaction-inquiries-search.component';

describe('TransactionInquiriesSearchComponent', () => {
  let component: TransactionInquiriesSearchComponent;
  let fixture: ComponentFixture<TransactionInquiriesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionInquiriesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionInquiriesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
