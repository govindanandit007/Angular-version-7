import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMasterComponent } from './activity-master.component';

describe('ActivityMasterComponent', () => {
  let component: ActivityMasterComponent;
  let fixture: ComponentFixture<ActivityMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
