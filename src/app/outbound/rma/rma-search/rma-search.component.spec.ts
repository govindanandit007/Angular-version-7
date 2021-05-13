import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmaSearchComponent } from './rma-search.component';

describe('RmaSearchComponent', () => {
  let component: RmaSearchComponent;
  let fixture: ComponentFixture<RmaSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmaSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
