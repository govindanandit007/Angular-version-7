import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPrintComponent } from './manual-print.component';

describe('ManualPrintComponent', () => {
  let component: ManualPrintComponent;
  let fixture: ComponentFixture<ManualPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
