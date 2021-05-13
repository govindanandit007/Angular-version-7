import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomConversionSearchBarComponent } from './uom-conversion-search-bar.component';

describe('UomConversionSearchBarComponent', () => {
  let component: UomConversionSearchBarComponent;
  let fixture: ComponentFixture<UomConversionSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomConversionSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomConversionSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
