import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderissueComponent } from './workorderissue.component';

describe('WorkorderissueComponent', () => {
  let component: WorkorderissueComponent;
  let fixture: ComponentFixture<WorkorderissueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderissueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
