import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationIuDialogComponent } from './confirmation-iu-dialog.component';

describe('ConfirmationIuDialogComponent', () => {
  let component: ConfirmationIuDialogComponent;
  let fixture: ComponentFixture<ConfirmationIuDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationIuDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationIuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
