import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCountlistComponent } from './cycle-countlist.component';

describe('CycleCountlistComponent', () => {
  let component: CycleCountlistComponent;
  let fixture: ComponentFixture<CycleCountlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleCountlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleCountlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
