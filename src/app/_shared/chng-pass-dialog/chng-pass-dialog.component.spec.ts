import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChngPassDialogComponent } from './chng-pass-dialog.component';

describe('ChngPassDialogComponent', () => {
  let component: ChngPassDialogComponent;
  let fixture: ComponentFixture<ChngPassDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChngPassDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChngPassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
