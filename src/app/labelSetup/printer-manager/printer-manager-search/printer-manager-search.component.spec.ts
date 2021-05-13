import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterManagerSearchComponent } from './printer-manager-search.component';

describe('PrinterManagerSearchComponent', () => {
  let component: PrinterManagerSearchComponent;
  let fixture: ComponentFixture<PrinterManagerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterManagerSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterManagerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
