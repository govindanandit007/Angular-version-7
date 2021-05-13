import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchActivityGroupComponent } from './search-activity-group.component';

describe('SearchActivityGroupComponent', () => {
  let component: SearchActivityGroupComponent;
  let fixture: ComponentFixture<SearchActivityGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchActivityGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchActivityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
