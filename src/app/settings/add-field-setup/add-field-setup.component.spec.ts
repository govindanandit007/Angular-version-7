import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldSetupComponent } from './add-field-setup.component';

describe('AddFieldSetupComponent', () => {
  let component: AddFieldSetupComponent;
  let fixture: ComponentFixture<AddFieldSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFieldSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
