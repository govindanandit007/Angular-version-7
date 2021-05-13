import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWoComponent } from './create-wo.component';

describe('CreateWoComponent', () => {
  let component: CreateWoComponent;
  let fixture: ComponentFixture<CreateWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
