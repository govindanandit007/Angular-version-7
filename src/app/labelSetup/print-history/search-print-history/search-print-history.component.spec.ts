import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPrintHistoryComponent } from './search-print-history.component';

describe('SearchPrintHistoryComponent', () => {
  let component: SearchPrintHistoryComponent;
  let fixture: ComponentFixture<SearchPrintHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPrintHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPrintHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
