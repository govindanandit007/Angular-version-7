import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUomComponent } from './item-uom.component';

describe('ItemUomComponent', () => {
  let component: ItemUomComponent;
  let fixture: ComponentFixture<ItemUomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemUomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
