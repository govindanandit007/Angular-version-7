import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutawayPolicyComponent } from './putaway-policy.component';

describe('PutawayPolicyComponent', () => {
  let component: PutawayPolicyComponent;
  let fixture: ComponentFixture<PutawayPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutawayPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutawayPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
