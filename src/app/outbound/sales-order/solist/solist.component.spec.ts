import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolistComponent } from './solist.component';

describe('SolistComponent', () => {
  let component: SolistComponent;
  let fixture: ComponentFixture<SolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
