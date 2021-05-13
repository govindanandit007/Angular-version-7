import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialNoListComponent } from './serial-no-list.component';

describe('SerialNoListComponent', () => {
  let component: SerialNoListComponent;
  let fixture: ComponentFixture<SerialNoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialNoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
