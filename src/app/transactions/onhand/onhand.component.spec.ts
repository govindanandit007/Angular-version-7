import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnhandComponent } from './onhand.component';

describe('OnhandComponent', () => {
  let component: OnhandComponent;
  let fixture: ComponentFixture<OnhandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnhandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
