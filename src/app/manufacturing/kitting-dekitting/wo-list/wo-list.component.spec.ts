import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoListComponent } from './wo-list.component';

describe('WoListComponent', () => {
  let component: WoListComponent;
  let fixture: ComponentFixture<WoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
