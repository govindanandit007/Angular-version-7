import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterManagerListComponent } from './printer-manager-list.component';

describe('PrinterManagerListComponent', () => {
  let component: PrinterManagerListComponent;
  let fixture: ComponentFixture<PrinterManagerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterManagerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
