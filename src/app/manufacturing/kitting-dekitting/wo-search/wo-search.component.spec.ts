import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoSearchComponent } from './wo-search.component';

describe('WoSearchComponent', () => {
  let component: WoSearchComponent;
  let fixture: ComponentFixture<WoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
