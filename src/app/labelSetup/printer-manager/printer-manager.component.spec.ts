import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterManagerComponent } from './printer-manager.component';

describe('PrinterManagerComponent', () => {
  let component: PrinterManagerComponent;
  let fixture: ComponentFixture<PrinterManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
