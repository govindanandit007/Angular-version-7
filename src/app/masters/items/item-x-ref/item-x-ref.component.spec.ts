import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemXRefComponent } from './item-x-ref.component';

describe('ItemXRefComponent', () => {
  let component: ItemXRefComponent;
  let fixture: ComponentFixture<ItemXRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemXRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemXRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
