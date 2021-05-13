import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaveCriteriaComponent } from './add-wave-criteria.component';

describe('AddWaveCriteriaComponent', () => {
  let component: AddWaveCriteriaComponent;
  let fixture: ComponentFixture<AddWaveCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWaveCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWaveCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
