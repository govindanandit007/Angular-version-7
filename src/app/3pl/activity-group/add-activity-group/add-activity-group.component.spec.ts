import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityGroupComponent } from './add-activity-group.component';

describe('AddActivityGroupComponent', () => {
  let component: AddActivityGroupComponent;
  let fixture: ComponentFixture<AddActivityGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActivityGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
