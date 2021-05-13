import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCountSearchComponent } from './cycle-count-search.component';

describe('CycleCountSearchComponent', () => {
  let component: CycleCountSearchComponent;
  let fixture: ComponentFixture<CycleCountSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleCountSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleCountSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
