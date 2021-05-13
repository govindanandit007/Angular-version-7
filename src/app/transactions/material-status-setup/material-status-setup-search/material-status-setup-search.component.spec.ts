import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusSetupSearchComponent } from './material-status-setup-search.component';

describe('MaterialStatusSetupSearchComponent', () => {
  let component: MaterialStatusSetupSearchComponent;
  let fixture: ComponentFixture<MaterialStatusSetupSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStatusSetupSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusSetupSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
