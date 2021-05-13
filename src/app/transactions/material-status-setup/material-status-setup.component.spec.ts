import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusSetupComponent } from './material-status-setup.component';

describe('MaterialStatusSetupComponent', () => {
  let component: MaterialStatusSetupComponent;
  let fixture: ComponentFixture<MaterialStatusSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStatusSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
