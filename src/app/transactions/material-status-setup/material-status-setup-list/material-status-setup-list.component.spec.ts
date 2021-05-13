import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusSetupListComponent } from './material-status-setup-list.component';

describe('MaterialStatusSetupListComponent', () => {
  let component: MaterialStatusSetupListComponent;
  let fixture: ComponentFixture<MaterialStatusSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStatusSetupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
