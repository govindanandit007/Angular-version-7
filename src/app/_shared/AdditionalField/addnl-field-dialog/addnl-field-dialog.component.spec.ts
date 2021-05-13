import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnlFieldDialogComponent } from './addnl-field-dialog.component';

describe('AddnlFieldDialogComponent', () => {
  let component: AddnlFieldDialogComponent;
  let fixture: ComponentFixture<AddnlFieldDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnlFieldDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnlFieldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
