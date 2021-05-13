import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMasterListComponent } from './activity-master-list.component';

describe('ActivityMasterListComponent', () => {
  let component: ActivityMasterListComponent;
  let fixture: ComponentFixture<ActivityMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
