import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInquiriesListComponent } from './transaction-inquiries-list.component';

describe('TransactionInquiriesListComponent', () => {
  let component: TransactionInquiriesListComponent;
  let fixture: ComponentFixture<TransactionInquiriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionInquiriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionInquiriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
