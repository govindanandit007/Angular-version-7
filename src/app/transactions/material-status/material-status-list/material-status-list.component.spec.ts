import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusListComponent } from './material-status-list.component';

describe('MaterialStatusListComponent', () => {
  let component: MaterialStatusListComponent;
  let fixture: ComponentFixture<MaterialStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
