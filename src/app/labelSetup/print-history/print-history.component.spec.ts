import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHistoryComponent } from './print-history.component';

describe('PrintHistoryComponent', () => {
  let component: PrintHistoryComponent;
  let fixture: ComponentFixture<PrintHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
