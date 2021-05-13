import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBillingExecutionComponent } from './search-billing-execution.component';

describe('SearchBillingExecutionComponent', () => {
  let component: SearchBillingExecutionComponent;
  let fixture: ComponentFixture<SearchBillingExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBillingExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBillingExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
