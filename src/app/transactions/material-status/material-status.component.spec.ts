import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusComponent } from './material-status.component';

describe('MaterialStatusComponent', () => {
  let component: MaterialStatusComponent;
  let fixture: ComponentFixture<MaterialStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
