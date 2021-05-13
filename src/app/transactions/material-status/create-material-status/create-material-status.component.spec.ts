import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMaterialStatusComponent } from './create-material-status.component';

describe('CreateMaterialStatusComponent', () => {
  let component: CreateMaterialStatusComponent;
  let fixture: ComponentFixture<CreateMaterialStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMaterialStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMaterialStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
