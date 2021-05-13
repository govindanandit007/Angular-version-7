import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveplanComponent } from './waveplan.component';

describe('WaveplanComponent', () => {
  let component: WaveplanComponent;
  let fixture: ComponentFixture<WaveplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
