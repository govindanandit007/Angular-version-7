import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCycleCountComponent } from './add-cycle-count.component';

describe('AddCycleCountComponent', () => {
  let component: AddCycleCountComponent;
  let fixture: ComponentFixture<AddCycleCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCycleCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCycleCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
