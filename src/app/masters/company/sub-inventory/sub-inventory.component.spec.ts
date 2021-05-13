import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubInventoryComponent } from './sub-inventory.component';

describe('SubInventoryComponent', () => {
  let component: SubInventoryComponent;
  let fixture: ComponentFixture<SubInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
