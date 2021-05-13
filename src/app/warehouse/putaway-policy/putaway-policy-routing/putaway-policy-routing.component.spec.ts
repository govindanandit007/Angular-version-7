import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutawayPolicyRoutingComponent } from './putaway-policy-routing.component';

describe('PutawayPolicyRoutingComponent', () => {
  let component: PutawayPolicyRoutingComponent;
  let fixture: ComponentFixture<PutawayPolicyRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutawayPolicyRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutawayPolicyRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
