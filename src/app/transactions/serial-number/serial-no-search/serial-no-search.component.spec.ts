import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialNoSearchComponent } from './serial-no-search.component';

describe('SerialNoSearchComponent', () => {
  let component: SerialNoSearchComponent;
  let fixture: ComponentFixture<SerialNoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialNoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
