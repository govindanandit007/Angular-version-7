import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRevisionComponent } from './item-revision.component';

describe('ItemRevisionComponent', () => {
  let component: ItemRevisionComponent;
  let fixture: ComponentFixture<ItemRevisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRevisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
