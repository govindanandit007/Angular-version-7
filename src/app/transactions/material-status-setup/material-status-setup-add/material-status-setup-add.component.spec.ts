import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusSetupAddComponent } from './material-status-setup-add.component';

describe('MaterialStatusSetupAddComponent', () => {
  let component: MaterialStatusSetupAddComponent;
  let fixture: ComponentFixture<MaterialStatusSetupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStatusSetupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusSetupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
