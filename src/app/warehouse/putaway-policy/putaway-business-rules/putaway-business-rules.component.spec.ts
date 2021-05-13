import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutawayBusinessRulesComponent } from './putaway-business-rules.component';

describe('PutawayBusinessRulesComponent', () => {
  let component: PutawayBusinessRulesComponent;
  let fixture: ComponentFixture<PutawayBusinessRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutawayBusinessRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutawayBusinessRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
