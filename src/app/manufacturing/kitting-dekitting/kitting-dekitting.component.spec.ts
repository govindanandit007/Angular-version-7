import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KittingDekittingComponent } from './kitting-dekitting.component';

describe('KittingDekittingComponent', () => {
  let component: KittingDekittingComponent;
  let fixture: ComponentFixture<KittingDekittingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KittingDekittingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KittingDekittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
