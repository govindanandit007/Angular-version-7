import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTradingPartnerComponent } from './add-trading-partner.component';

describe('AddTradingPartnerComponent', () => {
  let component: AddTradingPartnerComponent;
  let fixture: ComponentFixture<AddTradingPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTradingPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTradingPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
