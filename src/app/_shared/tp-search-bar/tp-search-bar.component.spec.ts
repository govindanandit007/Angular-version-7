import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpSearchBarComponent } from './tp-search-bar.component';

describe('TpSearchBarComponent', () => {
  let component: TpSearchBarComponent;
  let fixture: ComponentFixture<TpSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
