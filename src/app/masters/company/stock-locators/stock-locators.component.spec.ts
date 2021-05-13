import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLocatorsComponent } from './stock-locators.component';

describe('StockLocatorsComponent', () => {
  let component: StockLocatorsComponent;
  let fixture: ComponentFixture<StockLocatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockLocatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockLocatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
