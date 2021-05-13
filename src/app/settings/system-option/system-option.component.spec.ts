import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemOptionComponent } from './system-option.component';

describe('SystemOptionComponent', () => {
  let component: SystemOptionComponent;
  let fixture: ComponentFixture<SystemOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
