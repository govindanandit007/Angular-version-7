import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSoComponent } from './add-so.component';

describe('AddSoComponent', () => {
  let component: AddSoComponent;
  let fixture: ComponentFixture<AddSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
