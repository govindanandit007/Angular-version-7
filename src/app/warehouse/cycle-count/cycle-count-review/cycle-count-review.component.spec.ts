import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCountReviewComponent } from './cycle-count-review.component';

describe('CycleCountReviewComponent', () => {
  let component: CycleCountReviewComponent;
  let fixture: ComponentFixture<CycleCountReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleCountReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleCountReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
