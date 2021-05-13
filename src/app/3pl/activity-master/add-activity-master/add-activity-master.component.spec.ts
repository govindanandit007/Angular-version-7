import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityMasterComponent } from './add-activity-master.component';

describe('AddActivityMasterComponent', () => {
  let component: AddActivityMasterComponent;
  let fixture: ComponentFixture<AddActivityMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActivityMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
