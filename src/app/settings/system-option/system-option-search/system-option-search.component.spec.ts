import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemOptionSearchComponent } from './system-option-search.component';

describe('SystemOptionSearchComponent', () => {
  let component: SystemOptionSearchComponent;
  let fixture: ComponentFixture<SystemOptionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemOptionSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemOptionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
