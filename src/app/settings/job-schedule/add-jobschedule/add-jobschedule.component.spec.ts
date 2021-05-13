import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobscheduleComponent } from './add-jobschedule.component';

describe('AddJobscheduleComponent', () => {
  let component: AddJobscheduleComponent;
  let fixture: ComponentFixture<AddJobscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJobscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
