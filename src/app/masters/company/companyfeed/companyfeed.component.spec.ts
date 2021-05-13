import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyfeedComponent } from './companyfeed.component';

describe('CompanyfeedComponent', () => {
  let component: CompanyfeedComponent;
  let fixture: ComponentFixture<CompanyfeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyfeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
