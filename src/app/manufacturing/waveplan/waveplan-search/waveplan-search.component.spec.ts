import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveplanSearchComponent } from './waveplan-search.component';

describe('WaveplanSearchComponent', () => {
  let component: WaveplanSearchComponent;
  let fixture: ComponentFixture<WaveplanSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveplanSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveplanSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
