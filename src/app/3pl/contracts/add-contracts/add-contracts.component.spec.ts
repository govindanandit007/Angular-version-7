import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractsComponent } from './add-contracts.component';

describe('AddContractsComponent', () => {
  let component: AddContractsComponent;
  let fixture: ComponentFixture<AddContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
