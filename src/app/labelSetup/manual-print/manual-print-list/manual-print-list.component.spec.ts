import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPrintListComponent } from './manual-print-list.component';

describe('ManualPrintListComponent', () => {
  let component: ManualPrintListComponent;
  let fixture: ComponentFixture<ManualPrintListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualPrintListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPrintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
