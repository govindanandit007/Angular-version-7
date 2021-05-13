import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoSearchComponent } from './so-search.component';

describe('SoSearchComponent', () => {
  let component: SoSearchComponent;
  let fixture: ComponentFixture<SoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
