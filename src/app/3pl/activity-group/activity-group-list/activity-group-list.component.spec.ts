import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGroupListComponent } from './activity-group-list.component';

describe('ActivityGroupListComponent', () => {
  let component: ActivityGroupListComponent;
  let fixture: ComponentFixture<ActivityGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
