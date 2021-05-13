import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPartnerComponent } from './trading-partner.component';

describe('TradingPartnerComponent', () => {
  let component: TradingPartnerComponent;
  let fixture: ComponentFixture<TradingPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
