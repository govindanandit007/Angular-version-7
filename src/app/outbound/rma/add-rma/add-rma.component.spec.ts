import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRmaComponent } from './add-rma.component';

describe('AddRmaComponent', () => {
  let component: AddRmaComponent;
  let fixture: ComponentFixture<AddRmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
