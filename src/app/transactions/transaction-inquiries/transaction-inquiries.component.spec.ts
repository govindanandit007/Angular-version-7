import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInquiriesComponent } from './transaction-inquiries.component';

describe('TransactionInquiriesComponent', () => {
  let component: TransactionInquiriesComponent;
  let fixture: ComponentFixture<TransactionInquiriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionInquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionInquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
