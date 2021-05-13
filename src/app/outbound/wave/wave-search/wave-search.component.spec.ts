import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveSearchComponent } from './wave-search.component';

describe('WaveSearchComponent', () => {
  let component: WaveSearchComponent;
  let fixture: ComponentFixture<WaveSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
