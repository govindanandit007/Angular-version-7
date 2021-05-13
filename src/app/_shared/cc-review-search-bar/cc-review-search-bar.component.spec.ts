import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcReviewSearchBarComponent } from './cc-review-search-bar.component';

describe('CcReviewSearchBarComponent', () => {
  let component: CcReviewSearchBarComponent;
  let fixture: ComponentFixture<CcReviewSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcReviewSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcReviewSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
