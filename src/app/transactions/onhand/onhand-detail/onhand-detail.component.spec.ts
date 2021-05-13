import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnhandDetailComponent } from './onhand-detail.component';

describe('OnhandDetailComponent', () => {
  let component: OnhandDetailComponent;
  let fixture: ComponentFixture<OnhandDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnhandDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnhandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
