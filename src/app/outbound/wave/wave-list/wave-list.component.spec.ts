import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveListComponent } from './wave-list.component';

describe('WaveListComponent', () => {
  let component: WaveListComponent;
  let fixture: ComponentFixture<WaveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
