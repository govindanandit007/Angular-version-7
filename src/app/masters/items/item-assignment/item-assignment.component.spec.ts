import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAssignmentComponent } from './item-assignment.component';

describe('ItemAssignmentComponent', () => {
  let component: ItemAssignmentComponent;
  let fixture: ComponentFixture<ItemAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
