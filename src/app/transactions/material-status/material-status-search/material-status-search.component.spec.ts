import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusSearchComponent } from './material-status-search.component';

describe('MaterialStatusSearchComponent', () => {
  let component: MaterialStatusSearchComponent;
  let fixture: ComponentFixture<MaterialStatusSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStatusSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
