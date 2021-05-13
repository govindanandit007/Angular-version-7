import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundLpnListComponent } from './outbound-lpn-list.component';

describe('OutboundLpnListComponent', () => {
  let component: OutboundLpnListComponent;
  let fixture: ComponentFixture<OutboundLpnListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundLpnListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundLpnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
