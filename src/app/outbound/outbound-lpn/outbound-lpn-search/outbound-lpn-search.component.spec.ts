import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundLpnSearchComponent } from './outbound-lpn-search.component';

describe('OutboundLpnSearchComponent', () => {
  let component: OutboundLpnSearchComponent;
  let fixture: ComponentFixture<OutboundLpnSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundLpnSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundLpnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
