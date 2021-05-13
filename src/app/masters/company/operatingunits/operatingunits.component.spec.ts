import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingunitsComponent } from './operatingunits.component';

describe('OperatingunitsComponent', () => {
  let component: OperatingunitsComponent;
  let fixture: ComponentFixture<OperatingunitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatingunitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatingunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
