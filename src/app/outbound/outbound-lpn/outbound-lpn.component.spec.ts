import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundLpnComponent } from './outbound-lpn.component';

describe('OutboundLpnComponent', () => {
  let component: OutboundLpnComponent;
  let fixture: ComponentFixture<OutboundLpnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundLpnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundLpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
