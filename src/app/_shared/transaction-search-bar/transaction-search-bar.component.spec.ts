import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSearchBarComponent } from './transaction-search-bar.component';

describe('TransactionSearchBarComponent', () => {
  let component: TransactionSearchBarComponent;
  let fixture: ComponentFixture<TransactionSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
