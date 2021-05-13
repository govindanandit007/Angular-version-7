import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsnSearchComponent } from './asn-search.component';

describe('AsnSearchComponent', () => {
  let component: AsnSearchComponent;
  let fixture: ComponentFixture<AsnSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsnSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
