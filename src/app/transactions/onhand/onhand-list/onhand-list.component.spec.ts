import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnhandListComponent } from './onhand-list.component';

describe('OnhandListComponent', () => {
  let component: OnhandListComponent;
  let fixture: ComponentFixture<OnhandListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnhandListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnhandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
