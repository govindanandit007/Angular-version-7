import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmaListComponent } from './rma-list.component';

describe('RmaListComponent', () => {
  let component: RmaListComponent;
  let fixture: ComponentFixture<RmaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
