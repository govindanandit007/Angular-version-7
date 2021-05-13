import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAsnComponent } from './add-asn.component';

describe('AddAsnComponent', () => {
  let component: AddAsnComponent;
  let fixture: ComponentFixture<AddAsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
