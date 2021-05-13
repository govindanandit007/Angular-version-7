import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHistoryListComponent } from './print-history-list.component';

describe('PrintHistoryListComponent', () => {
  let component: PrintHistoryListComponent;
  let fixture: ComponentFixture<PrintHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
