import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchActivityMasterComponent } from './search-activity-master.component';

describe('SearchActivityMasterComponent', () => {
  let component: SearchActivityMasterComponent;
  let fixture: ComponentFixture<SearchActivityMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchActivityMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchActivityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
